import React from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    RefreshControl,
    Platform,
    Text,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PostCard } from './components/PostCard';
import { Input } from '../../components/Input';
import { Search } from 'lucide-react-native';
import { useHome } from './hooks/useHome';
import { PostSkeleton } from './components/PostSkeleton';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors, NeuShadow, NeuBorder } from '@/constants/Colors';

export function Home() {
    const { theme } = useThemeStore();
    const colors = Colors[theme];
    const shadow = NeuShadow[theme];
    const {
        filteredPosts,
        searchQuery,
        setSearchQuery,
        isLoadingPosts,
        isFetchingMore,
        refreshing,
        onRefresh,
        handleEndReached,
    } = useHome();

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <View style={[styles.header, { borderBottomWidth: NeuBorder.width, borderBottomColor: colors.border }]}>
                        <View style={styles.headerTop}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={[styles.headerTitle, { color: colors.text }]}>Feeds</Text>
                                <View style={[styles.titleBadge, { backgroundColor: colors.primary, borderColor: colors.border, borderWidth: NeuBorder.width }]}>
                                    <Text style={styles.badgeText}>{filteredPosts.length}</Text>
                                </View>
                            </View>
                        </View>

                        <Input
                            placeholder="Search by username..."
                            placeholderTextColor={colors.textSecondary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            leftIcon={<Search size={18} color={colors.textSecondary} />}
                            containerStyle={styles.searchInputContainer}
                            style={[styles.searchInput, { color: colors.text }]}
                        />
                    </View>

                    {isLoadingPosts && filteredPosts.length === 0 ? (
                        <View style={{ flex: 1 }}>
                            {[1, 2, 3, 4, 5].map((key) => (
                                <PostSkeleton key={key} />
                            ))}
                        </View>
                    ) : (
                        <FlatList
                            data={filteredPosts}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => <PostCard post={item} />}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    tintColor={colors.primary}
                                    colors={[colors.primary]}
                                />
                            }
                            onEndReached={handleEndReached}
                            onEndReachedThreshold={0.4}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={styles.emptyBox}>
                                    <Text style={[styles.emptyIcon, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: NeuBorder.width, padding: 20 }]}>📭</Text>
                                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                                        {searchQuery ? 'No users found matching that search.' : 'No posts yet.'}
                                    </Text>
                                </View>
                            }
                            ListFooterComponent={
                                isFetchingMore ? (
                                    <View style={styles.footerLoader}>
                                        <PostSkeleton />
                                        <PostSkeleton />
                                    </View>
                                ) : null
                            }
                        />
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1 },
    header: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
        borderBottomWidth: NeuBorder.width,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    headerIconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    onlineDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 10,
        height: 10,
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: '900',
        letterSpacing: -1,
    },
    titleBadge: {
        marginLeft: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    searchInputContainer: {
        marginBottom: 0,
    },
    searchInput: {
        height: 48,
        fontSize: 15,
    },
    listContent: {
        paddingTop: 10,
        paddingBottom: 100,
        paddingHorizontal: 16,
    },
    emptyBox: {
        paddingTop: 80,
        alignItems: 'center',
        gap: 12
    },
    emptyIcon: {
        fontSize: 48,
        opacity: 0.6,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    footerLoader: {
        paddingVertical: 24,
    },
});
