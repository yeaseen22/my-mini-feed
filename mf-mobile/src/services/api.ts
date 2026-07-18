import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://my-mini-feed.onrender.com/api/v1';

// Render free tier cold-starts can take up to 60 seconds
const TIMEOUT_MS = 60000;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 5000;

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
    },
    timeout: TIMEOUT_MS,
});

// Attach Bearer token to every request
api.interceptors.request.use(async (config) => {
    try {
        const token = await AsyncStorage.getItem('@access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('Error reading token for interceptor:', error);
    }
    return config;
}, (error) => Promise.reject(error));

// Retry on timeout / network errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;

        if (!config) return Promise.reject(error);

        const url = config.url || '';
        const isAuthRequest = url.includes('/auth/login') || url.includes('/auth/register');
        const isRetryable = error.code === 'ECONNABORTED' ||
            error.code === 'ERR_NETWORK' ||
            (error.response?.status >= 500 && error.response?.status < 600);

        // Initialize retry state
        if (!config.__retryCount) config.__retryCount = 0;

        if (isRetryable && !isAuthRequest && config.__retryCount < MAX_RETRIES) {
            config.__retryCount += 1;
            console.log(`Retrying request (${config.__retryCount}/${MAX_RETRIES}): ${url}`);
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
            return api(config);
        }

        // Handle Token Expiry (skip for login/register as 401 there means invalid credentials)
        if (error.response?.status === 401 && !isAuthRequest) {
            const { useAuthStore } = await import('../store/useAuthStore');
            const { router } = await import('expo-router');

            // Clear local state and token
            await useAuthStore.getState().logout(true);

            // Redirect to login
            router.replace('/(auth)/login');

            return Promise.reject(new Error('Session expired. Please login again.'));
        }

        if (error.code === 'ECONNABORTED') {
            return Promise.reject(new Error('Server is still waking up. Please try again.'));
        }

        // Extract the best possible error message from the response
        const message = error.response?.data?.message || error.response?.data?.error || error.response?.data?.details || error.message || 'Something went wrong';

        return Promise.reject(new Error(message));
    }
);
