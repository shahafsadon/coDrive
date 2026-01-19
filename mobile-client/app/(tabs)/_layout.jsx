import { Tabs, Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/AuthContext';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const { isAuthenticated, loading } = useAuth();


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
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'My Drive',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={26} name="folder.fill" color={color} />
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
                name="trash"
                options={{
                    title: 'Trash',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={26} name="trash.fill" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
