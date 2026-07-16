import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { Home, PlusSquare, Bell, User } from 'lucide-react-native';
import { Platform, StyleSheet, View } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors, NeuShadow, NeuBorder } from '@/constants/Colors';
import { useAuthStore } from '@/store/useAuthStore';

export default function TabLayout() {
    const { theme } = useThemeStore();
    const colors = Colors[theme];
    const shadow = NeuShadow[theme];
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/login" />;
    }

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarShowLabel: true,
            tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: '800',
                marginBottom: Platform.OS === 'ios' ? 0 : 4,
            },
            tabBarStyle: {
                position: 'absolute',
                bottom: Platform.OS === 'ios' ? 24 : 16,
                left: 20,
                right: 20,
                borderRadius: 0,
                height: 70,
                backgroundColor: colors.card,
                borderTopWidth: 0,
                borderWidth: NeuBorder.width,
                borderColor: colors.border,
                marginLeft: 20,
                marginRight: 20,
                paddingBottom: Platform.OS === 'ios' ? 0 : 10,
                paddingTop: 10,
                ...shadow,
            },
            tabBarItemStyle: {
                height: 60,
            }
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={focused ? [styles.activeIconBg, { backgroundColor: colors.primary, borderColor: colors.border, borderWidth: NeuBorder.width }] : null}>
                            <Home color={focused ? '#FFFFFF' : color} size={24} strokeWidth={focused ? 2.5 : 2} />
                        </View>
                    )
                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    title: 'Share',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={focused ? [styles.activeIconBg, { backgroundColor: colors.accent, borderColor: colors.border, borderWidth: NeuBorder.width }] : null}>
                            <PlusSquare color={focused ? '#FFFFFF' : color} size={24} strokeWidth={focused ? 2.5 : 2} />
                        </View>
                    )
                }}
            />
            <Tabs.Screen
                name="notification"
                options={{
                    title: 'Activity',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={focused ? [styles.activeIconBg, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: NeuBorder.width }] : null}>
                            <Bell color={focused ? '#000000' : color} size={24} strokeWidth={focused ? 2.5 : 2} />
                        </View>
                    )
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Me',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={focused ? [styles.activeIconBg, { backgroundColor: colors.primary, borderColor: colors.border, borderWidth: NeuBorder.width }] : null}>
                            <User color={focused ? '#FFFFFF' : color} size={24} strokeWidth={focused ? 2.5 : 2} />
                        </View>
                    )
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    activeIconBg: {
        width: 40,
        height: 40,
        borderRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
    }
});
