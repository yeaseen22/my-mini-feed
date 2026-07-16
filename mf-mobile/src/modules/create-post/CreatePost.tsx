import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Platform,
    KeyboardAvoidingView,
    Alert,
    Image,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/Button';
import { useCreatePost } from './hooks/useCreatePost';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors, NeuShadow, NeuBorder } from '@/constants/Colors';
import { AvatarRenderer } from '../profile/components/AvatarRenderer';

export function CreatePost() {
    const {
        content,
        setContent,
        isSubmitting,
        error,
        canSubmit,
        charCount,
        isOverLimit,
        user,
        avatarUri,
        handleSubmit,
        handleCancel,
    } = useCreatePost();

    const { theme } = useThemeStore();
    const colors = Colors[theme];
    const shadow = NeuShadow[theme];

    React.useEffect(() => {
        if (error) Alert.alert('Post Failed', error);
    }, [error]);

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
                style={[styles.container, { backgroundColor: colors.background }]}
            >
                <View style={[styles.header, { borderBottomWidth: NeuBorder.width, borderBottomColor: colors.border }]}>
                    <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
                        <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>New Post</Text>
                    <Button
                        title="Publish"
                        onPress={handleSubmit}
                        disabled={!canSubmit}
                        isLoading={isSubmitting}
                        style={styles.publishBtn}
                    />
                </View>

                <View style={styles.composeRow}>
                    {user?.avatarConfig ? (
                        <View style={{ marginRight: 14, marginTop: 2 }}>
                            <AvatarRenderer config={user.avatarConfig} size={46} />
                        </View>
                    ) : (
                        <Image source={{ uri: avatarUri }} style={[styles.avatar, { borderColor: colors.border, borderWidth: NeuBorder.width }]} />
                    )}
                    <View style={styles.inputWrapper}>
                        <Text style={[styles.authorName, { color: colors.text }]}>
                            {user?.fullName || user?.username || 'You'}
                        </Text>
                        <TextInput
                            style={[styles.input, { color: colors.text }]}
                            placeholder="What's on your mind?"
                            placeholderTextColor={colors.textSecondary}
                            multiline
                            autoFocus
                            value={content}
                            onChangeText={setContent}
                            textAlignVertical="top"
                            scrollEnabled={false}
                        />
                    </View>
                </View>

                <View style={[styles.footer, { borderTopWidth: NeuBorder.width, borderTopColor: colors.border }]}>
                    <Text style={[styles.charCount, isOverLimit ? { color: colors.danger } : { color: colors.textSecondary }]}>
                        {280 - charCount} characters left
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: NeuBorder.width,
    },
    cancelBtn: { paddingVertical: 4, paddingHorizontal: 4, minWidth: 60 },
    cancelText: { fontSize: 16, fontWeight: '600' },
    headerTitle: { fontSize: 17, fontWeight: '700' },
    publishBtn: { paddingVertical: 8, paddingHorizontal: 18, minWidth: 80 },
    composeRow: { flexDirection: 'row', padding: 20, flex: 1 },
    avatar: { width: 46, height: 46, borderRadius: 0, marginRight: 14, marginTop: 2 },
    inputWrapper: { flex: 1 },
    authorName: { fontWeight: '700', fontSize: 15, marginBottom: 6 },
    input: { flex: 1, fontSize: 18, lineHeight: 26, minHeight: 100 },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderTopWidth: NeuBorder.width,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    charCount: { fontSize: 13, fontWeight: '500' },
});
