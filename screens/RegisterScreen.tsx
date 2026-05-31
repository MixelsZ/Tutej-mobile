import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import Heading from '../components/Heading';
import MyText from '../components/MyText';
import InputField from '../components/InputField';
import Button from '../components/Button';
import TextLink from '../components/TextLink';
// Importujemy Twój nowy komponent
import SearchableSelect from '../components/SearchableSelect';
import { COLORS } from '../styles/theme';

export default function RegisterScreen() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        neighborhoodId: 0 // Zmienione na number, bo tak zwraca SearchableSelect
    });

    const [error, setError] = useState<string | null>(null);

    const validate = () => {
        const { fullName, email, password, neighborhoodId } = formData;

        if (!fullName || !email || !password || !neighborhoodId) {
            return 'Wszystkie pola są wymagane.';
        }

        const nameParts = fullName.trim().split(/\s+/);
        if (nameParts.length < 2) {
            return 'Imię i nazwisko muszą składać się z co najmniej dwóch słów.';
        }

        const isEachPartLongEnough = nameParts.every((part) => part.length >= 3);
        if (!isEachPartLongEnough) {
            return 'Zarówno imię, jak i nazwisko muszą mieć co najmniej 3 litery.';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Wprowadź poprawny adres e-mail.';
        }

        if (password.length < 8) {
            return 'Hasło musi mieć co najmniej 8 znaków.';
        }

        if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
            return 'Hasło musi zawierać przynajmniej jedną wielką literę i jedną cyfrę.';
        }

        return null;
    };

    const handleRegister = async () => {
        const errorMessage = validate();

        if (errorMessage) {
            setError(errorMessage);
            return;
        }

        setError(null);

        const nameParts = formData.fullName.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');

        try {
            const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email: formData.email,
                    password: formData.password,
                    neighborhoodId: formData.neighborhoodId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Wystąpił błąd podczas rejestracji.');
                return;
            } else {
                Alert.alert("Sukces", "Konto utworzone! Możesz się teraz zalogować.");
                router.replace('/');
            }
        } catch (e) {
            setError('Nie można połączyć się z serwerem.');
        }
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
                        <View style={styles.container}>
                            <Heading text="Utwórz konto" />

                            <View style={styles.form}>
                                <MyText text="Twoje dane" />
                                <InputField
                                    placeholder="Imię i nazwisko"
                                    type="text"
                                    icon="person"
                                    onChange={(val) => setFormData({ ...formData, fullName: val })}
                                />
                                <InputField
                                    placeholder="Adres e-mail"
                                    type="email"
                                    icon="at"
                                    onChange={(val) => setFormData({ ...formData, email: val })}
                                />
                                <InputField
                                    placeholder="Hasło"
                                    type="password"
                                    icon="lock"
                                    onChange={(val) => setFormData({ ...formData, password: val })}
                                />

                                {/* Tu wstawiamy SearchableSelect zamiast InputField */}
                                <MyText text="Twoje osiedle" style={{ marginTop: 10 }} />
                                <SearchableSelect
                                    onChange={(id) => setFormData({ ...formData, neighborhoodId: id })}
                                />

                                <Button text="Zarejestruj się" onClick={handleRegister} />
                                {error ? <MyText text={error} style={styles.errorMsg} /> : null}
                            </View>

                            <View style={styles.question}>
                                <MyText text="Posiadasz już konto?" />
                                <TextLink href="/" text="Zaloguj się" />
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 40,
        paddingVertical: 20,
    },
    container: {
        gap: 30,
    },
    form: {
        gap: 15,
    },
    question: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginTop: 10,
    },
    errorMsg: {
        color: '#dc3232',
        fontSize: 14,
        fontWeight: '700',
        marginTop: 5,
    }
});