import React from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TextInputProps,
    ViewStyle,
    StyleProp
} from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors, NeuShadow, NeuBorder } from '@/constants/Colors';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
}

export function Input({
    label,
    error,
    leftIcon,
    rightIcon,
    style,
    containerStyle,
    ...props
}: InputProps) {
    const { theme } = useThemeStore();
    const colors = Colors[theme];
    const shadow = NeuShadow[theme];

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
            <View
                style={[
                    styles.inputContainer,
                    {
                        backgroundColor: colors.inputBackground,
                        borderColor: error ? colors.danger : colors.border,
                    },
                    shadow,
                    error && styles.inputContainerError,
                ]}
            >
                {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
                <TextInput
                    style={[styles.input, { color: colors.text }, style]}
                    placeholderTextColor={colors.textSecondary}
                    autoCorrect={false}
                    pointerEvents="auto"
                    {...props}
                />
                {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
            </View>
            {error && <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: NeuBorder.width,
        borderRadius: NeuBorder.radius,
        minHeight: 52,
        paddingHorizontal: 12,
    },
    inputContainerError: {
        borderColor: '#FF4444',
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        paddingVertical: 12,
    },
    iconLeft: {
        marginRight: 10,
    },
    iconRight: {
        marginLeft: 10,
    },
    errorText: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: '600',
    },
});
