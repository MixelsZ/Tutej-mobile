import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    ActivityIndicator,
    Alert,
    FlatList
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Heading from '../components/Heading';
import MyText from '../components/MyText';
import Button from '../components/Button';
import InputField from '../components/InputField';
import NoticeCard from '../components/NoticeCard'; // Pamiętaj o przerobieniu tego komponentu!
import { COLORS } from '../styles/theme';

interface Notice {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    author: {
        firstName: string;
        lastName: string;
        role: string;
    };
}

export default function NoticesScreen() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            const role = await SecureStore.getItemAsync('userRole'); // Zakładam, że zapisałeś to przy logowaniu
            setUserRole(role);

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/notices`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setNotices(data);
        } catch (err) {
            console.error(err);
            Alert.alert("Błąd", "Nie udało się pobrać ogłoszeń");
        } finally {
            setLoading(false);
        }
    };

    const canPost = userRole === 'COUNCILLOR' || userRole === 'ADMIN';

    return (
        <View style={styles.mainContainer}>
            <View style={styles.header}>
                <View>
                    <Heading text="Ogłoszenia" />
                    <MyText text="Ważne informacje od radnych" style={styles.subtitle} />
                </View>
                {canPost && (
                    <Button
                        text="+"
                        variant="primary"
                        onClick={() => {/* Tu otworzysz modal dodawania */}}
                        // W mobile "+" często wygląda lepiej niż długi tekst w nagłówku
                    />
                )}
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={notices}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <NoticeCard notice={item} />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    }
});