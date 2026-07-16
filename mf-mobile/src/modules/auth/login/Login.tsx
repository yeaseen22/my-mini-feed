import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Mail, Lock, Sparkles } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useLogin } from './hooks/useLogin';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors, NeuShadow, NeuBorder } from '@/constants/Colors';

export function Login() {
    const router = useRouter();
    const { theme } = useThemeStore();
    const colors = Colors[theme];
    const shadow = NeuShadow[theme];
    const {
        email, setEmail,
        password, setPassword,
        isLoading,
        error,
        handleLogin,
    } = useLogin();

    React.useEffect(() => {
        if (error) Alert.alert('Login Failed', error);
    }, [error]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: colors.background }}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.headerContainer}>
                        <View style={[styles.iconWrapper, { backgroundColor: colors.primary, borderColor: colors.border, borderWidth: NeuBorder.width }, shadow]}>
                            <Sparkles size={40} color="#FFFFFF" strokeWidth={2} />
                        </View>
                        <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Sign in to continue to MiniFeeds</Text>
                    </View>

                    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: NeuBorder.width }, shadow]}>
                        <View style={styles.form}>
                            <Input
                                label="Email"
                                placeholder="Enter your email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                                leftIcon={<Mail size={20} color={colors.textSecondary} />}
                            />
                            <Input
                                label="Password"
                                placeholder="Enter your password"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                                leftIcon={<Lock size={20} color={colors.textSecondary} />}
                            />

                            <TouchableOpacity style={styles.forgotPassword}>
                                <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>Forgot Password?</Text>
                            </TouchableOpacity>

                            <Button
                                title="Sign In"
                                onPress={handleLogin}
                                isLoading={isLoading}
                                style={styles.loginBtn}
                            />
                        </View>

                        <View style={styles.footer}>
                            <Text style={[styles.footerText, { color: colors.textSecondary }]}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/register')}>
                                <Text style={[styles.registerText, { color: colors.primary }]}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { paddingHorizontal: 24, justifyContent: 'center', flexGrow: 1, paddingVertical: 40 },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 34,
        fontWeight: '900',
        marginBottom: 8,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    card: {
        padding: 24,
    },
    form: { marginBottom: 10 },
    forgotPassword: { alignSelf: 'flex-end', marginBottom: 24, marginTop: 4 },
    forgotPasswordText: { fontWeight: '700', fontSize: 14 },
    loginBtn: { marginTop: 8, height: 56 },
    footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 },
    footerText: { fontSize: 15, fontWeight: '500' },
    registerText: { fontWeight: '800', fontSize: 15 },
});
