import { View, Text, Alert, Image, ScrollView } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { api } from '@/services/api';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { FormInput, PrimaryButton, TextButton, Section } from '@/components/FormComponents';
import { GlobalStyles, Spacing, AppColors, ImageStyles, Typography } from '@/constants/appStyles';
import { logger } from '@/services/logger';
import * as SecureStore from 'expo-secure-store';

export default function RegisterScreen() {
    // Form State
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        email: '',
        phoneNumber: '',
        birthDate: '',
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState(null);

    // Handle field changes
    const handleFieldChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
        // Clear field-specific error
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
        // Clear general error
        if (generalError) {
            setGeneralError(null);
        }
    };

    // Request camera permissions
    const requestCameraPermissions = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            return status === 'granted';
        } catch (err) {
            logger.error('Register', 'Failed to request camera permission', err);
            return false;
        }
    };

    // Request media library permissions
    const requestMediaPermissions = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            return status === 'granted';
        } catch (err) {
            logger.error('Register', 'Failed to request media permission', err);
            return false;
        }
    };

    // Pick image from gallery
    const handlePickImage = async () => {
        try {
            const hasPermission = await requestMediaPermissions();
            if (!hasPermission) {
                Alert.alert('Permission Denied', 'Camera roll permission is required to select photos');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                const asset = result.assets[0];
                setSelectedImage({
                    uri: asset.uri,
                    name: asset.uri.split('/').pop() || 'profile.jpg',
                });
                logger.debug('Register', 'Image selected from gallery');
            }
        } catch (err) {
            logger.error('Register', 'Failed to pick image', err);
            Alert.alert('Error', 'Failed to pick image: ' + err.message);
        }
    };

    // Capture image from camera
    const handleCameraCapture = async () => {
        try {
            const hasPermission = await requestCameraPermissions();
            if (!hasPermission) {
                Alert.alert('Permission Denied', 'Camera permission is required to take photos');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                const asset = result.assets[0];
                setSelectedImage({
                    uri: asset.uri,
                    name: 'profile_' + Date.now() + '.jpg',
                });
                logger.debug('Register', 'Image captured from camera');
            }
        } catch (err) {
            logger.error('Register', 'Failed to capture image', err);
            Alert.alert('Error', 'Failed to capture image: ' + err.message);
        }
    };

    // Validation function (from web-client)
    const validate = () => {
        const newErrors = {};

        // Check mandatory fields
        if (!formData.username) {
            newErrors.username = 'Username is required';
        }

        if (!formData.fullName) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        } else if (!/[a-zA-Z]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one English letter';
        } else if (!/[0-9]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one number';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Validate email if provided
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }

        return newErrors;
    };

    // Handle registration
    const handleRegister = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setGeneralError('Please fix all errors before registering');
            logger.warn('Register', 'Validation failed');
            return;
        }

        try {
            setLoading(true);
            setGeneralError(null);
            logger.debug('Register', 'Starting registration');

            // Remove confirmPassword from API call
            const { confirmPassword, ...apiData } = formData;

            // Call API with or without image
            const response = await api.register(apiData, selectedImage);

            if (response.error) {
                logger.error('Register', 'Registration failed', response.error);
                setGeneralError(response.error);
                Alert.alert('Registration Failed', response.error);
                return;
            }

            logger.info('Register', 'Registration successful');
            Alert.alert('Success', 'User registered successfully');

            // Navigate to login
            router.replace('/(auth)/login');
        } catch (err) {
            logger.error('Register', 'Unexpected error', err);
            const errorMsg = err.message || 'Registration failed';
            setGeneralError(errorMsg);
            Alert.alert('Error', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper scrollable>
            <View style={{ paddingVertical: Spacing.lg }}>
                <Section title="Create Account">
                    {/* Profile Image Section */}
                    <View style={[GlobalStyles.flexCenter, { marginBottom: Spacing.lg }]}>
                        {selectedImage ? (
                            <Image
                                source={{ uri: selectedImage.uri }}
                                style={ImageStyles.profileImage}
                            />
                        ) : (
                            <View style={[ImageStyles.profileImage, GlobalStyles.flexCenter, { borderWidth: 2, borderColor: AppColors.border, borderStyle: 'dashed' }]}>
                                <Text style={{ color: AppColors.textSecondary, fontSize: 36 }}>📷</Text>
                            </View>
                        )}
                        <View style={{ gap: Spacing.sm, marginTop: Spacing.md, width: '100%' }}>
                            <PrimaryButton
                                title={selectedImage ? 'Change Photo' : 'Pick from Gallery'}
                                onPress={handlePickImage}
                                disabled={loading}
                            />
                            <PrimaryButton
                                title="Take Photo"
                                onPress={handleCameraCapture}
                                disabled={loading}
                            />
                            {selectedImage && (
                                <PrimaryButton
                                    title="Remove Photo"
                                    onPress={() => setSelectedImage(null)}
                                    disabled={loading}
                                    style={{ backgroundColor: AppColors.textSecondary }}
                                />
                            )}
                        </View>
                    </View>

                    {/* General Error Message */}
                    {generalError && (
                        <View style={{ backgroundColor: AppColors.errorBackground, padding: 12, borderRadius: 8, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: AppColors.error }}>
                            <Text style={[Typography.bodySmall, { color: AppColors.error }]}>{generalError}</Text>
                        </View>
                    )}

                    {/* Username */}
                    <FormInput
                        label="Username *"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChangeText={value => handleFieldChange('username', value)}
                        error={errors.username}
                        editable={!loading}
                        autoCapitalize="none"
                    />

                    {/* Full Name */}
                    <FormInput
                        label="Full Name *"
                        placeholder="Your full name"
                        value={formData.fullName}
                        onChangeText={value => handleFieldChange('fullName', value)}
                        error={errors.fullName}
                        editable={!loading}
                    />

                    {/* Email */}
                    <FormInput
                        label="Email (Optional)"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChangeText={value => handleFieldChange('email', value)}
                        error={errors.email}
                        editable={!loading}
                        keyboardType="email-address"
                    />

                    {/* Phone Number */}
                    <FormInput
                        label="Phone Number (Optional)"
                        placeholder="+972 5X-XXX-XXXX"
                        value={formData.phoneNumber}
                        onChangeText={value => handleFieldChange('phoneNumber', value)}
                        error={errors.phoneNumber}
                        editable={!loading}
                        keyboardType="phone-pad"
                    />

                    {/* Birth Date */}
                    <FormInput
                        label="Birth Date (Optional)"
                        placeholder="YYYY-MM-DD"
                        value={formData.birthDate}
                        onChangeText={value => handleFieldChange('birthDate', value)}
                        error={errors.birthDate}
                        editable={!loading}
                    />

                    {/* Password */}
                    <FormInput
                        label="Password *"
                        placeholder="Min 8 chars, letter & number"
                        value={formData.password}
                        onChangeText={value => handleFieldChange('password', value)}
                        error={errors.password}
                        editable={!loading}
                        secureTextEntry
                    />

                    {/* Confirm Password */}
                    <FormInput
                        label="Confirm Password *"
                        placeholder="Repeat password"
                        value={formData.confirmPassword}
                        onChangeText={value => handleFieldChange('confirmPassword', value)}
                        error={errors.confirmPassword}
                        editable={!loading}
                        secureTextEntry
                    />

                    {/* Register Button */}
                    <PrimaryButton
                        title={loading ? 'Registering...' : 'Create Account'}
                        onPress={handleRegister}
                        disabled={loading}
                        loading={loading}
                    />

                    {/* Login Link */}
                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: Spacing.lg }}>
                        <Text style={Typography.bodySmall}>Already have an account?</Text>
                        <TextButton
                            title="Login"
                            onPress={() => router.replace('/(auth)/login')}
                        />
                    </View>
                </Section>
            </View>
        </ScreenWrapper>
    );
}
