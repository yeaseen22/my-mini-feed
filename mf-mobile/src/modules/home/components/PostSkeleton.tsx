import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors, NeuBorder } from '@/constants/Colors';

export function PostSkeleton() {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [opacity]);

    const { theme } = useThemeStore();
    const colors = Colors[theme];
    const pulseColor = theme === 'dark' ? '#374151' : '#E5E7EB';

    return (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: NeuBorder.width }]}>
            <View style={styles.header}>
                <Animated.View style={[styles.avatar, { opacity, backgroundColor: pulseColor, borderColor: colors.border }]} />
                <View style={styles.authorInfo}>
                    <Animated.View style={[styles.titleLine, { opacity, backgroundColor: pulseColor }]} />
                    <Animated.View style={[styles.metaLine, { opacity, backgroundColor: pulseColor, marginTop: 4 }]} />
                </View>
            </View>
            <View style={styles.content}>
                <Animated.View style={[styles.contentLine, { width: '85%', opacity, backgroundColor: pulseColor }]} />
                <Animated.View style={[styles.contentLine, { width: '95%', opacity, backgroundColor: pulseColor }]} />
                <Animated.View style={[styles.contentLine, { width: '30%', opacity, backgroundColor: pulseColor }]} />
            </View>
            <View style={styles.actionsBox}>
                <Animated.View style={[styles.actionBtn, { opacity, backgroundColor: pulseColor }]} />
                <Animated.View style={[styles.actionBtn, { opacity, backgroundColor: pulseColor }]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        paddingVertical: 18,
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 0,
        marginRight: 12,
    },
    authorInfo: {
        flex: 1,
    },
    titleLine: {
        height: 14,
        width: '35%',
        borderRadius: 0,
    },
    metaLine: {
        height: 10,
        width: '20%',
        borderRadius: 0,
    },
    content: {
        marginBottom: 18,
        gap: 10,
    },
    contentLine: {
        height: 14,
        borderRadius: 0,
    },
    actionsBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 32,
    },
    actionBtn: {
        height: 24,
        width: 48,
        borderRadius: 0,
    },
});
