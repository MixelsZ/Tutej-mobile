import * as SecureStore from 'expo-secure-store';
import { decode as atob } from 'base-64'; // zainstaluj: npx expo install base-64

export interface CurrentUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    photo: string | null;
    role: 'USER' | 'COUNCILLOR' | 'ADMIN';
    neighborhoodId: number;
}

// Funkcje w RN muszą być asynchroniczne, bo SecureStore tak działa
export async function getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('token');
}

export async function getAuthHeaders() {
    const token = await getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
    const token = await getToken();
    if (!token) return null;
    try {
        // base-64 atob jest potrzebne w RN do dekodowania JWT
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
}

export async function logout() {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('userId');
}