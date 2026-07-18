import React, { useState } from 'react';
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

import { Mail, Lock, User, Users, Eye, EyeOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { useRegister } from './hooks/useRegister';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors, NeuShadow, NeuBorder } from '@/constants/Colors';

export function Register() {
    const router = useRouter();
    const { theme } = useThemeStore();
    const colors = Colors[theme];
    const shadow = NeuShadow[theme];
    const [showPassword, setShowPassword] = useState(false);
    const {
        fullName, setFullName,
        username, setUsername,
        email, setEmail,
        password, setPassword,
        isLoading,
        error,
        handleRegister,
    } = useRegister();

    React.useEffect(() => {
        if (error) Alert.alert('Registration Failed', error);
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
                        <View style={[styles.iconWrapper, { backgroundColor: colors.accent, borderColor: colors.border, borderWidth: NeuBorder.width }, shadow]}>
                            <Users size={40} color="#FFFFFF" strokeWidth={2} />
                        </View>
                        <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Join MiniFeeds to connect with friends</Text>
                    </View>

                    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: NeuBorder.width }, shadow]}>
                        <View style={styles.form}>
                            <Input
                                label="Full Name"
                                placeholder="John Doe"
                                value={fullName}
                                onChangeText={setFullName}
                                leftIcon={<User size={20} color={colors.textSecondary} />}
                            />
                            <Input
                                label="Username"
                                placeholder="@johndoe"
                                autoCapitalize="none"
                                value={username}
                                onChangeText={setUsername}
                                leftIcon={<User size={20} color={colors.textSecondary} />}
                            />
                            <Input
                                label="Email"
                                placeholder="hello@example.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                                leftIcon={<Mail size={20} color={colors.textSecondary} />}
                            />
                            <Input
                                label="Password"
                                placeholder="Create a password"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                                leftIcon={<Lock size={20} color={colors.textSecondary} />}
                                rightIcon={
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        {showPassword
                                            ? <EyeOff size={20} color={colors.textSecondary} />
                                            : <Eye size={20} color={colors.textSecondary} />
                                        }
                                    </TouchableOpacity>
                                }
                            />

                            <Button
                                title="Sign Up"
                                onPress={handleRegister}
                                isLoading={isLoading}
                                disabled={isLoading}
                                style={styles.registerBtn}
                            />
                        </View>

                        <View style={styles.footer}>
                            <Text style={[styles.footerText, { color: colors.textSecondary }]}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/login')}>
                                <Text style={[styles.loginText, { color: colors.primary }]}>Sign In</Text>
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
    container: { paddingHorizontal: 24, paddingVertical: 40, justifyContent: 'center', flexGrow: 1 },
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
    registerBtn: { marginTop: 24, height: 56 },
    footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24, paddingBottom: 24 },
    footerText: { fontSize: 15, fontWeight: '500' },
    loginText: { fontWeight: '800', fontSize: 15 },
});
