import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    LogOut,
    Moon,
    Sun,
    ChevronRight,
} from 'lucide-react-native';
import { useProfile } from './hooks/useProfile';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors, NeuShadow, NeuBorder } from '@/constants/Colors';
import { AvatarRenderer } from './components/AvatarRenderer';

const StatItem = ({ label, value, colors }: { label: string; value: number; colors: any }) => (
    <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
);

interface MenuItemProps {
    label: string;
    icon: any;
    color: string;
    value?: string;
    onPress: () => void;
    colors: any;
    theme: string;
    isDestructive?: boolean;
}

const MenuItem = ({ label, icon: Icon, color, value, onPress, colors, theme, isDestructive }: MenuItemProps) => (
    <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: NeuBorder.width }]}
        onPress={onPress}
    >
        <View style={[styles.menuIconWrapper, { backgroundColor: color }]}>
            <Icon size={20} color="#FFFFFF" />
        </View>
        <Text style={[styles.menuText, { color: isDestructive ? '#FF4444' : colors.text }]}>{label}</Text>
        <View style={styles.menuRight}>
            {value && <Text style={[styles.menuValue, { color: colors.textSecondary }]}>{value}</Text>}
            <ChevronRight size={18} color={colors.textSecondary} />
        </View>
    </TouchableOpacity>
);

export function Profile() {
    const { profile, isLoading, error, fetchProfile, handleLogout } = useProfile();
    const { theme, toggleTheme } = useThemeStore();
    const [refreshing, setRefreshing] = React.useState(false);
    const colors = Colors[theme];

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (profile) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }).start();
        }
    }, [profile, fadeAnim]);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await fetchProfile();
        setRefreshing(false);
    }, [fetchProfile]);

    if (isLoading && !refreshing && !profile) {
        return (
            <SafeAreaView style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </SafeAreaView>
        );
    }

    if (error && !profile) {
        return (
            <SafeAreaView style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
                <TouchableOpacity onPress={fetchProfile} style={[styles.retryBtn, { backgroundColor: colors.primary, borderColor: colors.border, borderWidth: NeuBorder.width }]}>
                    <Text style={styles.retryBtnText}>Retry</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const userName = profile?.fullName || 'User';
    const userHandle = profile?.username || 'username';
    const stats = profile?._count || { posts: 0, comments: 0, likes: 0 };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <SafeAreaView style={styles.safeArea}>
                <View style={[styles.mainHeader, { borderBottomWidth: NeuBorder.width, borderBottomColor: colors.border }]}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
                </View>

                <ScrollView
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.primary}
                        />
                    }
                >
                    <Animated.View style={[styles.profileSection, { opacity: fadeAnim }]}>
                        <View style={styles.avatarContainer}>
                            <View style={[styles.avatarOuterRing, { borderColor: colors.border, borderWidth: NeuBorder.width }]}>
                                {profile?.avatarConfig ? (
                                    <AvatarRenderer config={profile.avatarConfig} size={130} />
                                ) : (
                                    <Image source={{ uri: `https://i.pravatar.cc/150?u=${profile?.id || 'default'}` }} style={[styles.avatar, { borderColor: colors.border, borderWidth: NeuBorder.width }]} />
                                )}
                            </View>
                        </View>

                        <Text style={[styles.name, { color: colors.text }]}>{userName}</Text>
                        <Text style={[styles.username, { color: colors.textSecondary }]}>@{userHandle}</Text>

                        <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: NeuBorder.width }, ]}>
                            <StatItem label="Posts" value={stats.posts} colors={colors} />
                            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                            <StatItem label="Comments" value={stats.comments} colors={colors} />
                            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                            <StatItem label="Likes" value={stats.likes} colors={colors} />
                        </View>
                    </Animated.View>

                    <View style={styles.menuContainer}>
                        <Text style={[styles.menuSectionTitle, { color: colors.textSecondary }]}>
                            PREFERENCES
                        </Text>
                        <MenuItem
                            label="Dark Mode"
                            icon={theme === 'light' ? Moon : Sun}
                            color="#4ECDC4"
                            value={theme === 'dark' ? 'On' : 'Off'}
                            onPress={toggleTheme}
                            colors={colors}
                            theme={theme}
                        />

                        <Text style={[styles.menuSectionTitle, { color: colors.textSecondary, marginTop: 24 }]}>
                            ACCOUNT
                        </Text>
                        <MenuItem
                            label="Log Out"
                            icon={LogOut}
                            color="#FF4444"
                            onPress={handleLogout}
                            colors={colors}
                            theme={theme}
                            isDestructive
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { paddingBottom: 120 },
    mainHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 10,
        paddingTop: 8,
        zIndex: 10,
        borderBottomWidth: NeuBorder.width,
    },
    headerTitle: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
    profileSection: { alignItems: 'center', paddingVertical: 10 },
    avatarContainer: { position: 'relative', marginBottom: 20 },
    avatarOuterRing: {
        padding: 5,
        borderRadius: 0,
    },
    avatar: { width: 130, height: 130, borderRadius: 0 },
    name: { fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
    username: { fontSize: 16, fontWeight: '600', marginTop: 4, opacity: 0.6 },
    statsCard: {
        flexDirection: 'row',
        width: '90%',
        marginTop: 30,
        paddingVertical: 24,
        justifyContent: 'space-around',
    },
    statItem: { alignItems: 'center', flex: 1 },
    statValue: { fontSize: 22, fontWeight: '900' },
    statLabel: { fontSize: 13, fontWeight: '700', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
    statDivider: { width: 2, height: 40, opacity: 0.2 },
    menuContainer: { paddingHorizontal: 24, marginTop: 25 },
    menuSectionTitle: { fontSize: 12, fontWeight: '900', letterSpacing: 2, marginBottom: 15, marginLeft: 5 },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
    },
    menuIconWrapper: { width: 48, height: 48, borderRadius: 0, justifyContent: 'center', alignItems: 'center', marginRight: 18 },
    menuText: { flex: 1, fontSize: 16, fontWeight: '700' },
    menuRight: { flexDirection: 'row', alignItems: 'center' },
    menuValue: { fontSize: 14, fontWeight: '700', marginRight: 10, opacity: 0.5 },
    errorText: { fontSize: 16, textAlign: 'center', marginBottom: 20, paddingHorizontal: 40 },
    retryBtn: { paddingHorizontal: 24, paddingVertical: 12 },
    retryBtnText: { color: '#FFFFFF', fontWeight: '800' }
});
