import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { AppColors, Typography, Spacing } from '@/constants/appStyles';

export default function StarredScreen() {
    return (
        <ImageBackground
            source={require('@/assets/images/background.jpg')}
            style={{ flex: 1 }}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <Text style={styles.icon}>⭐</Text>
                <Text style={styles.title}>Starred</Text>
                <Text style={styles.subtitle}>
                    Starred files will appear here
                </Text>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: 'transparent',
    },
    icon: {
        fontSize: 64,
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 8,
        color: AppColors.text,
    },
    subtitle: {
        fontSize: 14,
        color: AppColors.textSecondary,
        textAlign: 'center',
    },
});
