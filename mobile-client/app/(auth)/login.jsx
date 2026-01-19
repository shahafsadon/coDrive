import { View, Text, Alert } from 'react-native';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { FormInput, PrimaryButton, TextButton, Section } from '@/components/FormComponents';
import { Typography, AppColors, Spacing, GlobalStyles } from '@/constants/appStyles';
import { logger } from '@/services/logger';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen() {
    const { login } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Handle form validation
    const validate = () => {
        if (!username || !password) {
            setError('Username and password are required');
            return false;
        }
        return true;
    };

    // Handle login submission
    const handleLogin = async () => {
        setError(null);

        if (!validate()) {
            logger.warn('Auth', 'Login validation failed');
            return;
        }

        try {
            setLoading(true);
            logger.debug('Auth', 'Attempting login', { username });

            // Call API endpoint
            const response = await api.login(username, password);

            if (response.error) {
                logger.error('Auth', 'Login failed', response.error);
                setError(response.error);
                Alert.alert('Login Failed', response.error);
                return;
            }

            if (!response.data?.token) {
                logger.error('Auth', 'No token received');
                setError('No token received from server');
                Alert.alert('Error', 'No token received from server');
                return;
            }

            // Store token and user info securely
            const token = response.data.token;
            const userId = response.data.userId || response.data.id;

            await SecureStore.setItemAsync('token', token);
            if (userId) {
                await SecureStore.setItemAsync('userId', userId.toString());
                await SecureStore.setItemAsync('username', username);
            }

            logger.info('Auth', 'Login successful');

            // Update auth context and navigate
            await login(token);
            router.replace('/(tabs)');
        } catch (err) {
            logger.error('Auth', 'Unexpected error', err);
            const errorMsg = err.message || 'Login failed';
            setError(errorMsg);
            Alert.alert('Error', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Clear error when user starts typing
    const handleUsernameChange = (value) => {
        setUsername(value);
        if (error) setError(null);
    };

    const handlePasswordChange = (value) => {
        setPassword(value);
        if (error) setError(null);
    };

    return (
        <ScreenWrapper scrollable>
            <View style={{ flex: 1, justifyContent: 'center', paddingVertical: Spacing.lg }}>
                <Section title="Welcome Back">
                    {/* Username Input */}
                    <FormInput
                        label="Username"
                        placeholder="Enter your username"
                        value={username}
                        onChangeText={handleUsernameChange}
                        error={error && !username ? 'Username is required' : null}
                        editable={!loading}
                        autoCapitalize="none"
                    />

                    {/* Password Input */}
                    <FormInput
                        label="Password"
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={handlePasswordChange}
                        error={error && !password ? 'Password is required' : null}
                        secureTextEntry
                        editable={!loading}
                    />

                    {/* Error Message */}
                    {error && (
                        <View style={{ backgroundColor: AppColors.errorBackground, padding: 12, borderRadius: 8, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: AppColors.error }}>
                            <Text style={[Typography.bodySmall, { color: AppColors.error }]}>{error}</Text>
                        </View>
                    )}

                    {/* Login Button */}
                    <PrimaryButton
                        title={loading ? 'Logging in...' : 'Login'}
                        onPress={handleLogin}
                        disabled={loading || !username || !password}
                        loading={loading}
                    />

                    {/* Sign Up Link */}
                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: Spacing.lg }}>
                        <Text style={Typography.bodySmall}>Don't have an account?</Text>
                        <TextButton
                            title="Sign up"
                            onPress={() => router.push('/(auth)/register')}
                        />
                    </View>
                </Section>
            </View>
        </ScreenWrapper>
    );
}
