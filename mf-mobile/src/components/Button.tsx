import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacityProps
} from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors, NeuShadow, NeuBorder } from '@/constants/Colors';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    isLoading?: boolean;
}

export function Button({
    title,
    variant = 'primary',
    isLoading = false,
    style,
    ...props
}: ButtonProps) {
    const { theme } = useThemeStore();
    const colors = Colors[theme];
    const shadow = NeuShadow[theme];
    const isPrimary = variant === 'primary';
    const isSecondary = variant === 'secondary';
    const isOutline = variant === 'outline';
    const isGhost = variant === 'ghost';

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[
                styles.button,
                { borderWidth: NeuBorder.width, borderColor: colors.border },
                isPrimary && [styles.primaryBtn, shadow],
                isSecondary && styles.secondaryBtn,
                isOutline && styles.outlineBtn,
                isGhost && styles.ghostBtn,
                props.disabled && styles.disabledBtn,
                style,
            ]}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator color={isPrimary ? '#fff' : colors.primary} />
            ) : (
                <Text
                    style={[
                        styles.text,
                        isPrimary && styles.primaryText,
                        isSecondary && [styles.secondaryText, { color: colors.text }],
                        isOutline && [styles.outlineText, { color: colors.text }],
                        isGhost && [styles.ghostText, { color: colors.textSecondary }],
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: NeuBorder.radius,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    primaryBtn: {
        backgroundColor: '#FF6B6B',
    },
    secondaryBtn: {
        backgroundColor: '#FFE66D',
    },
    outlineBtn: {
        backgroundColor: 'transparent',
    },
    ghostBtn: {
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    disabledBtn: {
        opacity: 0.5,
    },
    text: {
        fontSize: 16,
        fontWeight: '700',
    },
    primaryText: {
        color: '#FFFFFF',
    },
    secondaryText: {},
    outlineText: {},
    ghostText: {},
});
