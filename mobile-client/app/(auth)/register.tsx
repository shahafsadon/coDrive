import { View, Text, TextInput, StyleSheet, Button, Alert, ScrollView } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { api } from '@/services/api';
import {
    validateRegistrationForm,
    ValidationError,
    RegistrationFormData,
} from '@/services/validators';

export default function RegisterScreen() {
    const [formData, setFormData] = useState<RegistrationFormData>({
        username: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        email: '',
        phoneNumber: '',
        birthDate: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const handleFieldChange = (field: keyof RegistrationFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleRegister = async () => {
        // Validate form
        const validationErrors = validateRegistrationForm(formData);
        if (validationErrors.length > 0) {
            const errorMap: Record<string, string> = {};
            validationErrors.forEach(error => {
                errorMap[error.field] = error.message;
            });
            setErrors(errorMap);
            Alert.alert('Validation Error', 'Please fix all errors before registering');
            return;
        }

        try {
            setLoading(true);

            // Remove confirmPassword from API call
            const { confirmPassword, ...apiData } = formData;

            const response = await api.register(apiData);

            if (response.error) {
                Alert.alert('Registration failed', response.error);
                return;
            }

            Alert.alert('Success', 'User registered successfully');
            router.replace('/(auth)/login');
        } catch (err: any) {
            Alert.alert('Error', err.message);
        } finally {
            setLoading(false);
        }
    };

    const getErrorStyle = (field: string) => {
        return errors[field] ? { borderColor: '#ff6b6b', borderWidth: 2 } : {};
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            {/* Username */}
            <Text style={styles.label}>Username *</Text>
            <TextInput
                style={[styles.input, getErrorStyle('username')]}
                placeholder="Username"
                autoCapitalize="none"
                value={formData.username}
                onChangeText={value => handleFieldChange('username', value)}
                editable={!loading}
            />
            {errors.username && <Text style={styles.error}>{errors.username}</Text>}

            {/* Full Name */}
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
                style={[styles.input, getErrorStyle('fullName')]}
                placeholder="Full Name"
                value={formData.fullName}
                onChangeText={value => handleFieldChange('fullName', value)}
                editable={!loading}
            />
            {errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}

            {/* Email */}
            <Text style={styles.label}>Email (Optional)</Text>
            <TextInput
                style={[styles.input, getErrorStyle('email')]}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={value => handleFieldChange('email', value)}
                editable={!loading}
            />
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}

            {/* Phone Number */}
            <Text style={styles.label}>Phone Number (Optional)</Text>
            <TextInput
                style={[styles.input, getErrorStyle('phoneNumber')]}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={formData.phoneNumber}
                onChangeText={value => handleFieldChange('phoneNumber', value)}
                editable={!loading}
            />
            {errors.phoneNumber && <Text style={styles.error}>{errors.phoneNumber}</Text>}

            {/* Birth Date */}
            <Text style={styles.label}>Birth Date (Optional, YYYY-MM-DD)</Text>
            <TextInput
                style={[styles.input, getErrorStyle('birthDate')]}
                placeholder="YYYY-MM-DD"
                value={formData.birthDate}
                onChangeText={value => handleFieldChange('birthDate', value)}
                editable={!loading}
            />
            {errors.birthDate && <Text style={styles.error}>{errors.birthDate}</Text>}

            {/* Password */}
            <Text style={styles.label}>Password *</Text>
            <TextInput
                style={[styles.input, getErrorStyle('password')]}
                placeholder="Password (min 8 chars, must contain letter & number)"
                secureTextEntry
                value={formData.password}
                onChangeText={value => handleFieldChange('password', value)}
                editable={!loading}
            />
            {errors.password && <Text style={styles.error}>{errors.password}</Text>}

            {/* Confirm Password */}
            <Text style={styles.label}>Confirm Password *</Text>
            <TextInput
                style={[styles.input, getErrorStyle('confirmPassword')]}
                placeholder="Confirm Password"
                secureTextEntry
                value={formData.confirmPassword}
                onChangeText={value => handleFieldChange('confirmPassword', value)}
                editable={!loading}
            />
            {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}

            {/* Register Button */}
            <Button
                title={loading ? 'Registering...' : 'Register'}
                onPress={handleRegister}
                disabled={loading}
            />

            {/* Login Link */}
            <Text
                style={styles.link}
                onPress={() => router.replace('/(auth)/login')}
            >
                Already have an account? Login
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 24,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        marginTop: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 6,
        marginBottom: 4,
        fontSize: 16,
    },
    error: {
        color: '#ff6b6b',
        fontSize: 12,
        marginBottom: 12,
    },
    link: {
        marginTop: 24,
        textAlign: 'center',
        color: '#0066cc',
        fontSize: 16,
        fontWeight: '500',
    },
});
