import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, SafeAreaView } from 'react-native';
import Heading from '../components/Heading';
import MyText from '../components/MyText';
import InputField from '../components/InputField';
import Button from '../components/Button';
import TextLink from '../components/TextLink';
import { COLORS } from '../constants/theme';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    return (
        <SafeAreaView style={styles.mainContainer}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <View style={styles.container}>
                    <Heading text="Witamy ponownie!" />

                    <View style={styles.form}>
                        <MyText text="Twoje dane" />
                        <InputField
                            placeholder="Adres e-mail"
                            type="email"
                            icon="at"
                            onChange={(val) => setEmail(val)}
                        />
                        <InputField
                            placeholder="Hasło"
                            type="password"
                            icon="lock"
                            onChange={(val) => setPassword(val)}
                        />
                        <Button text="Zaloguj się" />

                        {error && (
                            <View style={styles.errorContainer}>
                                <MyText text={error} />
                            </View>
                        )}
                    </View>

                    <View style={styles.question}>
                        <MyText text="Nie posiadasz jeszcze konta?" />
                        <TextLink href="/register" text="Zarejestruj się" />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    scrollContainer: {
        paddingTop: 80,
        paddingBottom: 50,
        paddingLeft: 40,
        gap: 40,
    },
    illustration: {
        width: 200,
        height: 200,
        alignSelf: 'flex-start',
    },
    container: {
        paddingRight: 40,
        gap: 40,
    },
    form: {
        gap: 15,
    },
    errorContainer: {
        marginTop: 5,
    },
    question: {
        gap: 5,
    },
});