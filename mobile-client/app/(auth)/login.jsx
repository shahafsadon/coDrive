import { View, Text, Alert, Image, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/services/api';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { KeyboardAvoidingWrapper } from '@/components/KeyboardAvoidingWrapper';
import { FormInput, PrimaryButton, TextButton, Section } from '@/components/FormComponents';
import { Typography, AppColors, Spacing, GlobalStyles } from '@/constants/appStyles';
import { logger } from '@/services/logger';
import { router } from 'expo-router';

export default function LoginScreen() {
    const { login } = useAuth();
    const { isDarkMode, toggleTheme, colors } = useTheme();

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

            // Call API endpoint to authenticate
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

            logger.info('Auth', 'Login successful');

            // Update auth context (handles storage with proper platform detection)
            await login(token, userId, username);
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
        <ImageBackground
            source={require('@/assets/images/background.jpg')}
            style={{ flex: 1 }}
            resizeMode="cover"
        >
            {isDarkMode && (
                <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.7)' }} />
            )}
            {/* Theme Toggle Button */}
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    top: 50,
                    right: 20,
                    zIndex: 100,
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: 24,
                    padding: 10,
                }}
                onPress={toggleTheme}
            >
                <Text style={{ fontSize: 24 }}>
                    {isDarkMode ? '☀️' : '🌙'}
                </Text>
            </TouchableOpacity>
            <ScreenWrapper>
                <KeyboardAvoidingWrapper>
                    <View style={{ flex: 1, justifyContent: 'center', paddingVertical: Spacing.sm }}>
                    {/* Logo */}
                    <View style={{ alignItems: 'center', marginBottom: Spacing.lg, marginTop: -80 }}>
                        <Image
                            source={require('@/assets/images/logo.png')}
                            style={{ width: 400, height: 110, resizeMode: 'contain' }}
                        />
                        <Text style={[Typography.h2, { color: AppColors.primary, marginTop: Spacing.sm }]}>
                            Sign In
                        </Text>
                        <Text style={[Typography.bodySmall, { color: AppColors.textSecondary, marginTop: 4 }]}>
                            to continue to CoDrive
                        </Text>
                    </View>

                    <Section>
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
                        <View style={{ backgroundColor: AppColors.errorBackground, padding: 10, borderRadius: 6, marginBottom: 15, border: 1, borderColor: '#fad2cf' }}>
                            <Text style={[Typography.bodySmall, { color: AppColors.error, textAlign: 'center' }]}>{error}</Text>
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
                    <View style={{ alignItems: 'center', marginTop: Spacing.lg, gap: 5 }}>
                        <Text style={[Typography.bodySmall, { color: AppColors.textSecondary }]}>New to CoDrive?</Text>
                        <TextButton
                            title="Create account"
                            onPress={() => router.push('/(auth)/register')}
                            style={{ fontSize: 17, fontWeight: '700' }}
                        />
                    </View>
                </Section>
                    </View>
                </KeyboardAvoidingWrapper>
            </ScreenWrapper>
        </ImageBackground>
    );
}
