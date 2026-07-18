import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MessageSquare, Users, Bell, Sparkles } from 'lucide-react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors, NeuShadow, NeuBorder } from '@/constants/Colors';

const { width } = Dimensions.get('window');

const SLIDES = [
    {
        icon: MessageSquare,
        title: 'Share Your Thoughts',
        description: 'Create short posts and share what\'s on your mind with the community.',
        color: '#FF6B6B',
    },
    {
        icon: Users,
        title: 'Connect with Others',
        description: 'Follow interesting people, like posts, and join conversations.',
        color: '#4ECDC4',
    },
    {
        icon: Bell,
        title: 'Stay Notified',
        description: 'Get real-time notifications when someone likes or comments on your posts.',
        color: '#FFE66D',
    },
];

export default function WelcomeScreen() {
    const router = useRouter();
    const { theme } = useThemeStore();
    const colors = Colors[theme];
    const shadow = NeuShadow[theme];
    const [currentIndex, setCurrentIndex] = useState(0);

    const slide = SLIDES[currentIndex];
    const Icon = slide.icon;

    const handleNext = async () => {
        if (currentIndex < SLIDES.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            await AsyncStorage.setItem('@has_seen_welcome', 'true');
            router.replace('/(auth)/login');
        }
    };

    const handleSkip = async () => {
        await AsyncStorage.setItem('@has_seen_welcome', 'true');
        router.replace('/(auth)/login');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.topRow}>
                <TouchableOpacity onPress={handleSkip}>
                    <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: slide.color, borderColor: colors.border, borderWidth: NeuBorder.width }, shadow]}>
                    <Icon size={48} color="#FFFFFF" strokeWidth={2} />
                </View>
                <Text style={[styles.title, { color: colors.text }]}>{slide.title}</Text>
                <Text style={[styles.description, { color: colors.textSecondary }]}>{slide.description}</Text>
            </View>

            <View style={styles.bottom}>
                <View style={styles.dots}>
                    {SLIDES.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                {
                                    backgroundColor: i === currentIndex ? colors.primary : colors.border,
                                    width: i === currentIndex ? 24 : 8,
                                },
                            ]}
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={[styles.nextBtn, { backgroundColor: colors.primary, borderColor: colors.border, borderWidth: NeuBorder.width }, shadow]}
                    onPress={handleNext}
                    activeOpacity={0.8}
                >
                    <Text style={styles.nextBtnText}>
                        {currentIndex < SLIDES.length - 1 ? 'Next' : 'Get Started'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topRow: {
        alignItems: 'flex-end',
        paddingHorizontal: 24,
        paddingTop: 12,
    },
    skipText: {
        fontSize: 16,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 16,
        letterSpacing: -0.5,
    },
    description: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 24,
    },
    bottom: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        alignItems: 'center',
    },
    dots: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 32,
    },
    dot: {
        height: 8,
        borderRadius: 0,
    },
    nextBtn: {
        width: width - 80,
        height: 56,
        borderRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextBtnText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
    },
});
