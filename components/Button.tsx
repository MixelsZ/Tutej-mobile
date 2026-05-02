import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../constants/theme';

interface ButtonProps {
    text: string;
    variant?: 'primary' | 'secondary';
    onClick?: () => void;
}

export default function Button({ text, variant = 'primary', onClick }: ButtonProps) {
    const isPrimary = variant === 'primary';

    const gradientColors = isPrimary
        ? [COLORS.green, COLORS.lightGreen]
        : [COLORS.gray, COLORS.white];

    const borderColors = isPrimary
        ? [COLORS.lightGreen, COLORS.green]
        : [COLORS.white, COLORS.gray];

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={onClick}
                style={styles.shadowWrapper}
            >
                <LinearGradient
                    colors={borderColors}
                    style={styles.borderGradient}
                >
                    <LinearGradient
                        colors={gradientColors}
                        style={styles.innerGradient}
                    >
                        <Text style={[
                            styles.text,
                            { color: isPrimary ? COLORS.white : COLORS.black }
                        ]}>
                            {text}
                        </Text>
                    </LinearGradient>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.gray,
        padding: 5,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    shadowWrapper: {
        borderRadius: 10,
        elevation: 8,
        shadowColor: COLORS.darkGray,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
    borderGradient: {
        padding: 4,
        borderRadius: 10,
    },
    innerGradient: {
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontFamily: FONTS.heading,
        fontWeight: '500',
        fontSize: 16,
        textAlign: 'center',
        includeFontPadding: false,
        textAlignVertical: 'center',
        lineHeight: 22,
    },
});