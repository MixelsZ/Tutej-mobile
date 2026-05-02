import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { FONTS, COLORS } from '../constants/theme';

interface TextProps {
    text: string;
}

export default function MyText({ text }: TextProps) {
    return <RNText style={styles.text}>{text}</RNText>;
}

const styles = StyleSheet.create({
    text: {
        fontFamily: FONTS.regular,
        fontSize: 16,
        color: COLORS.black,
        margin: 0,
    },
});