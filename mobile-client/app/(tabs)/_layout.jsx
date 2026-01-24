import { Tabs, Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
    const { isAuthenticated, loading } = useAuth();
    const { colors } = useTheme();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/login" />;
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarActiveTintColor: colors.tint,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: colors.background,
                    borderTopColor: colors.border,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={26} name="house" color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="starred"
                options={{
                    title: 'Starred',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={26} name="star.fill" color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="shared"
                options={{
                    title: 'Shared',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={26} name="person.2" color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="files"
                options={{
                    title: 'Files',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={26} name="folder.fill" color={color} />
                    ),
                }}
            />

            <Tabs.Screen name="trash" options={{ href: null }} />
            <Tabs.Screen name="drive" options={{ href: null }} />
        </Tabs>
    );
}
