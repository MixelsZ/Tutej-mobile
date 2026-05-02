import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Heading from '../components/Heading';
import MyText from '../components/MyText';
import InputField from '../components/InputField';
import Button from '../components/Button';
import TextLink from '../components/TextLink';
import Illustration from '../assets/illustrations/01.svg';
import { COLORS } from '../constants/theme';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    return (
        <SafeAreaView style={styles.mainContainer}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
                        <Illustration
                            width={360}
                            height={240}
                            style={styles.illustration}
                        />

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
                                <Button text="Zaloguj się" variant="primary" />
                                {error ? <MyText text={error} style={styles.errorMsg} /> : null}
                            </View>

                            <View style={styles.question}>
                                <MyText text="Nie posiadasz jeszcze konta?" />
                                <TextLink href="/register" text="Zarejestruj się" />
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
        paddingTop: 0,
        paddingBottom: 50,
        paddingLeft: 40,
        gap: 20,
    },
    illustration: {
        alignSelf: 'flex-end',
        marginRight: -60,
        marginTop: -20,
    },
    container: {
        paddingRight: 40,
        gap: 40,
    },
    form: {
        gap: 15,
    },
    question: {
        gap: 0,
    },
    errorMsg: {
        color: 'red',
        fontSize: 14,
    }
});