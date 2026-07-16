import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Heart, MessageSquare, MoreHorizontal, Trash2 } from 'lucide-react-native';
import { Post, useFeedStore } from '../../../store/useFeedStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors, NeuShadow, NeuBorder } from '@/constants/Colors';
import { CommentsSheet } from './CommentsSheet';
import { timeAgo } from '@/utils/date';
import { ActionSheet } from '@/components/ActionSheet';
import { AvatarRenderer } from '../../profile/components/AvatarRenderer';

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const { toggleLike, deletePost } = useFeedStore();
    const [menuVisible, setMenuVisible] = useState(false);
    const [commentsVisible, setCommentsVisible] = useState(false);

    const handleToggleLike = useCallback(() => {
        toggleLike(post.id);
    }, [post.id, toggleLike]);

    const handleDelete = useCallback(() => {
        setMenuVisible(false);
        Alert.alert(
            'Delete Post',
            'Are you sure you want to delete this post? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deletePost(post.id);
                        } catch {
                            Alert.alert('Error', 'Failed to delete post.');
                        }
                    },
                },
            ]
        );
    }, [post.id, deletePost]);

    const { theme } = useThemeStore();
    const colors = Colors[theme];
    const shadow = NeuShadow[theme];
    const user = useAuthStore((state) => state.user);
    const isOwner = user?.id === post.authorId;

    const authorName = post.author?.fullName || post.author?.email?.split('@')[0] || 'Unknown';

    return (
        <>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: NeuBorder.width }, shadow]}>
                <View style={styles.header}>
                    {post.author?.avatarConfig ? (
                        <View style={{ marginRight: 12 }}>
                            <AvatarRenderer config={post.author.avatarConfig} size={44} />
                        </View>
                    ) : (
                        <Image
                            source={{ uri: `https://i.pravatar.cc/150?u=${post.authorId}` }}
                            style={[styles.avatar, { borderColor: colors.border, borderWidth: NeuBorder.width }]}
                        />
                    )}
                    <View style={styles.authorInfo}>
                        <Text style={[styles.fullName, { color: colors.text }]}>
                            {authorName}
                        </Text>
                        <Text style={[styles.username, { color: colors.textSecondary }]}>
                            @{post.author?.username} · {timeAgo(post.createdAt)}
                        </Text>
                    </View>
                    {isOwner && (
                        <TouchableOpacity onPress={() => setMenuVisible(true)} style={[styles.moreButton, { borderColor: colors.border, borderWidth: NeuBorder.width }]}>
                            <MoreHorizontal size={22} color={colors.text} />
                        </TouchableOpacity>
                    )}
                </View>

                <Text style={[styles.content, { color: colors.text }]}>{post.content}</Text>

                <View style={[styles.actionsBox, { borderTopWidth: NeuBorder.width, borderTopColor: colors.border }]}>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        activeOpacity={0.7}
                        onPress={handleToggleLike}
                    >
                        <Heart
                            size={22}
                            color={post.isLikedByMe ? '#FF4444' : colors.textSecondary}
                            fill={post.isLikedByMe ? '#FF4444' : 'transparent'}
                        />
                        <Text style={[styles.actionText, post.isLikedByMe && { color: '#FF4444' }, { color: colors.textSecondary }]}>
                            {post._count?.likes || 0}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7} onPress={() => setCommentsVisible(true)}>
                        <MessageSquare size={22} color={colors.textSecondary} />
                        <Text style={[styles.actionText, { color: colors.textSecondary }]}>
                            {post._count?.comments || 0}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ActionSheet
                visible={menuVisible}
                onClose={() => setMenuVisible(false)}
                title="Post Options"
                options={[
                    {
                        label: 'Delete Post',
                        icon: Trash2,
                        variant: 'danger',
                        onPress: handleDelete
                    }
                ]}
            />

            <CommentsSheet
                visible={commentsVisible}
                postId={post.id}
                onClose={() => setCommentsVisible(false)}
            />
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 0,
        marginRight: 12,
        backgroundColor: '#E5E7EB',
    },
    authorInfo: {
        flex: 1,
    },
    fullName: {
        fontWeight: '700',
        fontSize: 15,
    },
    username: {
        fontSize: 13,
        marginTop: 2,
    },
    moreButton: {
        padding: 4,
    },
    content: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 16,
    },
    actionsBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: NeuBorder.width,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 28,
    },
    actionText: {
        marginLeft: 7,
        fontSize: 14,
        fontWeight: '600',
    },
});
