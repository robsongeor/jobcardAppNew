import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

// Example helpers
export function setAuthToken(token: string) {
    storage.set('authToken', token);
}

export function getAuthToken(): string | undefined {
    return storage.getString('authToken');
}

export const getStoredUserField = (field: string): string | null => {
    const raw = storage.getString('user');
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw);
        return parsed[field] ?? null;
    } catch (err) {
        console.error('Failed to parse user from storage:', err);
        return null;
    }
};

// You can add more getters/setters for in-progress job cards, user prefs, etc.
