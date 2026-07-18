import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    FlatList,
    TextInput,
    Image,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Send, Trash2 } from 'lucide-react-native';
import { api } from '../../../services/api';
import { useAuthStore } from '../../../store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors, NeuShadow, NeuBorder } from '@/constants/Colors';
import { Comment } from '../../../store/useFeedStore';
import { timeAgo } from '@/utils/date';
import { AvatarRenderer } from '../../profile/components/AvatarRenderer';

interface CommentsSheetProps {
    visible: boolean;
    postId: string;
    onClose: () => void;
}

const LIMIT = 5;

export function CommentsSheet({ visible, postId, onClose }: CommentsSheetProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const user = useAuthStore((state) => state.user);
    const { theme } = useThemeStore();
    const colors = Colors[theme];
    const shadow = NeuShadow[theme];
    const insets = useSafeAreaInsets();

    const fetchComments = useCallback(async (pageNum: number, replace: boolean) => {
        if (replace) setIsLoading(true);
        else setIsLoadingMore(true);

        try {
            const res = await api.get(`/posts/${postId}/comments?page=${pageNum}&limit=${LIMIT}`);
            if (res.data?.success) {
                const fetched: Comment[] = res.data.data;
                setComments((prev) => replace ? fetched : [...prev, ...fetched]);
                setTotalPages(res.data.pagination?.totalPages ?? 0);
                setPage(pageNum);
            }
        } catch (e) {
            console.error('Failed to load comments', e);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [postId]);

    useEffect(() => {
        if (visible) {
            setComments([]);
            setPage(1);
            fetchComments(1, true);
        }
    }, [visible, fetchComments]);

    const handleLoadMore = () => {
        if (page < totalPages && !isLoadingMore) {
            fetchComments(page + 1, false);
        }
    };

    const handleSubmit = async () => {
        if (!newComment.trim()) return;
        setIsSubmitting(true);
        try {
            const res = await api.post(`/posts/${postId}/comment`, { content: newComment.trim() });
            if (res.data?.success) {
                setComments((prev) => [res.data.data, ...prev]);
                setNewComment('');
            }
        } catch (e) {
            Alert.alert('Error', 'Could not post comment.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId: string, authorId: string) => {
        if (user?.id !== authorId) return;

        Alert.alert('Delete Comment', 'Remove this comment?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await api.delete(`/posts/comments/${commentId}`);
                        setComments((prev) => prev.filter((c) => c.id !== commentId));
                    } catch {
                        Alert.alert('Error', 'Failed to delete comment.');
                    }
                },
            },
        ]);
    };

    const renderComment = ({ item }: { item: Comment }) => {
        const isOwner = user?.id === item.authorId;
        const authorLabel = item.author?.fullName || item.author?.email?.split('@')[0] || 'user';
        return (
            <View style={styles.commentRow}>
                {item.author?.avatarConfig ? (
                    <View style={{ marginRight: 10 }}>
                        <AvatarRenderer config={item.author.avatarConfig} size={36} />
                    </View>
                ) : (
                    <Image source={{ uri: `https://i.pravatar.cc/80?u=${item.authorId}` }} style={[styles.commentAvatar, { borderColor: colors.border, borderWidth: NeuBorder.width }]} />
                )}
                <View style={[styles.commentBubble, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: NeuBorder.width }]}>
                    <View style={styles.commentHeader}>
                        <Text style={[styles.commentAuthor, { color: colors.text }]}>{authorLabel}</Text>
                        <Text style={[styles.commentTime, { color: colors.textSecondary }]}>{timeAgo(item.createdAt)}</Text>
                    </View>
                    <Text style={[styles.commentContent, { color: colors.text }]}>{item.content}</Text>
                </View>
                {isOwner && (
                    <TouchableOpacity
                        onPress={() => handleDeleteComment(item.id, item.authorId)}
                        style={styles.deleteBtn}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Trash2 size={16} color={colors.danger} />
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                style={styles.overlay}
            >
                <TouchableOpacity style={styles.backdropPress} activeOpacity={1} onPress={onClose} />
                <View style={[styles.sheet, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: NeuBorder.width }, shadow]}>
                    <View style={[styles.handle, { backgroundColor: colors.text }]} />

                    <View style={[styles.header, { borderBottomWidth: NeuBorder.width, borderBottomColor: colors.border }]}>
                        <Text style={[styles.headerTitle, { color: colors.text }]}>Comments</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={22} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {isLoading ? (
                        <View style={styles.loadingBox}>
                            <ActivityIndicator color={colors.primary} size="large" />
                        </View>
                    ) : (
                        <FlatList
                            data={comments}
                            keyExtractor={(item) => item.id}
                            renderItem={renderComment}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={styles.emptyBox}>
                                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No comments yet. Be the first!</Text>
                                </View>
                            }
                            ListFooterComponent={
                                page < totalPages ? (
                                    <TouchableOpacity
                                        style={styles.loadMoreBtn}
                                        onPress={handleLoadMore}
                                        disabled={isLoadingMore}
                                    >
                                        {isLoadingMore
                                            ? <ActivityIndicator color={colors.primary} size="small" />
                                            : <Text style={[styles.loadMoreText, { color: colors.primary }]}>Load more comments</Text>
                                        }
                                    </TouchableOpacity>
                                ) : null
                            }
                        />
                    )}

                    <View style={[styles.inputBar, { borderTopWidth: NeuBorder.width, borderTopColor: colors.border, paddingBottom: Math.max(insets.bottom, 12) }]}>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border, borderWidth: NeuBorder.width }]}
                            placeholder="Write a comment..."
                            placeholderTextColor={colors.textSecondary}
                            value={newComment}
                            onChangeText={setNewComment}
                            multiline
                        />
                        <TouchableOpacity
                            style={[styles.sendBtn, { backgroundColor: colors.primary, borderColor: colors.border, borderWidth: NeuBorder.width }, !newComment.trim() && { opacity: 0.5 }]}
                            onPress={handleSubmit}
                            disabled={!newComment.trim() || isSubmitting}
                        >
                            {isSubmitting
                                ? <ActivityIndicator color="#fff" size="small" />
                                : <Send size={18} color="#fff" />
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    backdropPress: {
        flex: 1,
    },
    sheet: {
        maxHeight: '80%',
        minHeight: 400,
    },
    handle: {
        width: 40,
        height: 5,
        borderRadius: 0,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 4,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
    },
    closeBtn: {
        padding: 4,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
    },
    loadingBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyBox: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 15,
        fontWeight: '600',
    },
    commentRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 14,
    },
    commentAvatar: {
        width: 36,
        height: 36,
        borderRadius: 0,
        marginRight: 10,
        backgroundColor: '#E5E7EB',
    },
    commentBubble: {
        flex: 1,
        padding: 10,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    commentAuthor: {
        fontWeight: '600',
        fontSize: 13,
    },
    commentTime: {
        fontSize: 11,
    },
    commentContent: {
        fontSize: 14,
        lineHeight: 20,
    },
    deleteBtn: {
        marginTop: 8,
        marginLeft: 8,
    },
    loadMoreBtn: {
        alignItems: 'center',
        paddingVertical: 14,
        marginBottom: 4,
    },
    loadMoreText: {
        fontWeight: '600',
        fontSize: 14,
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 10,
    },
    input: {
        flex: 1,
        maxHeight: 100,
        borderRadius: 0,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
    },
    sendBtn: {
        width: 42,
        height: 42,
        borderRadius: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
