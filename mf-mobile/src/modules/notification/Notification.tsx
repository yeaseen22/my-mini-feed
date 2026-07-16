import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, StatusBar, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeStore } from '@/store/useThemeStore';
import { Colors, NeuShadow, NeuBorder } from '@/constants/Colors';
import { useNotificationStore } from '@/store/useNotificationStore';
import { BellOff, Bell } from 'lucide-react-native';
import { AvatarRenderer } from '../profile/components/AvatarRenderer';

export function Notification() {
    const { theme } = useThemeStore();
    const colors = Colors[theme];
    const shadow = NeuShadow[theme];
    const { notifications, isLoading, fetchNotifications } = useNotificationStore();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchNotifications();
        setRefreshing(false);
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <SafeAreaView style={styles.safeArea}>
                <View style={[styles.header, { borderBottomWidth: NeuBorder.width, borderBottomColor: colors.border }]}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
                    <View style={[styles.bellIconWrapper, { backgroundColor: colors.primary, borderColor: colors.border, borderWidth: NeuBorder.width }]}>
                        <Bell size={20} color="#FFFFFF" />
                    </View>
                </View>

                <FlatList
                    data={notifications}
                    keyExtractor={item => item.id}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.primary}
                            colors={[colors.primary]}
                        />
                    }
                    ListEmptyComponent={
                        isLoading ? (
                            <View style={styles.emptyContainer}>
                                <ActivityIndicator size="large" color={colors.primary} />
                                <Text style={[styles.emptyText, { color: colors.textSecondary, marginTop: 16 }]}>Loading activity...</Text>
                            </View>
                        ) : (
                            <View style={styles.emptyContainer}>
                                <View style={[styles.emptyIconContainer, { borderColor: colors.border, borderWidth: NeuBorder.width }]}>
                                    <BellOff size={40} color={colors.textSecondary} />
                                </View>
                                <Text style={[styles.emptyText, { color: colors.text }]}>No notifications yet</Text>
                                <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>When you get notifications, they'll show up here.</Text>
                            </View>
                        )
                    }
                    renderItem={({ item }) => (
                        <View style={[styles.notificationCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: NeuBorder.width }, shadow]}>
                            <View style={styles.avatarWrapper}>
                                {item.avatarConfig ? (
                                    <View style={{ marginRight: 16 }}>
                                        <AvatarRenderer config={item.avatarConfig} size={54} />
                                    </View>
                                ) : (
                                    <Image source={{ uri: item.avatar }} style={[styles.avatar, { borderColor: colors.border, borderWidth: NeuBorder.width }]} />
                                )}
                            </View>
                            <View style={styles.content}>
                                <Text style={[styles.message, { color: colors.text }]}>{item.text}</Text>
                                <Text style={[styles.time, { color: colors.textSecondary }]}>{item.time}</Text>
                            </View>
                        </View>
                    )}
                    contentContainerStyle={[styles.list, notifications.length === 0 && { flex: 1, justifyContent: 'center' }]}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 20,
        borderBottomWidth: NeuBorder.width,
    },
    headerTitle: { fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
    bellIconWrapper: { width: 44, height: 44, borderRadius: 0, justifyContent: 'center', alignItems: 'center' },
    list: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 120 },
    notificationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
    },
    avatarWrapper: { position: 'relative' },
    avatar: { width: 54, height: 54, borderRadius: 0, marginRight: 16 },
    content: { flex: 1 },
    message: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
    time: { fontSize: 13, fontWeight: '500', marginTop: 4, opacity: 0.8 },
    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
    emptyIconContainer: { width: 80, height: 80, borderRadius: 0, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    emptyText: { fontSize: 20, fontWeight: '800' },
    emptySubtext: { fontSize: 15, textAlign: 'center', marginTop: 8, opacity: 0.7 }
});
