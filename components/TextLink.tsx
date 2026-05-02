import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { COLORS, FONTS } from '../constants/theme';

interface TextLinkProps {
    href: string;
    text: string;
}

export default function TextLink({ href, text }: TextLinkProps) {
    return (
        <Link href={href} asChild>
            <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.textLink}>{text}</Text>
            </TouchableOpacity>
        </Link>
    );
}

const styles = StyleSheet.create({
    textLink: {
        fontFamily: FONTS.regular,
        color: COLORS.green,
        fontSize: 16,
        textDecorationLine: 'none',
    },
});