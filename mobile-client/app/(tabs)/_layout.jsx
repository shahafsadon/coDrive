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
            {/* Home tab - leftmost (hollow house icon) */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={26} name="house" color={color} />
                    ),
                }}
            />

            {/* Starred tab (keep current) */}
            <Tabs.Screen
                name="starred"
                options={{
                    title: 'Starred',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={26} name="star.fill" color={color} />
                    ),
                }}
            />

            {/* Shared tab (person with shadow) */}
            <Tabs.Screen
                name="shared"
                options={{
                    title: 'Shared',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={26} name="person.2" color={color} />
                    ),
                }}
            />

            {/* Files tab - rightmost (was My Drive, renamed to Files) */}
            <Tabs.Screen
                name="files"
                options={{
                    title: 'Files',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={26} name="folder.fill" color={color} />
                    ),
                }}
            />

            {/* Hide trash from bottom tabs - can access via settings/menu */}
            <Tabs.Screen
                name="trash"
                options={{
                    href: null, // Hide from tabs
                }}
            />

            {/* Hide drive.jsx from tabs - it's just a component */}
            <Tabs.Screen
                name="drive"
                options={{
                    href: null, // Hide from tabs
                }}
            />
        </Tabs>
    );
}
