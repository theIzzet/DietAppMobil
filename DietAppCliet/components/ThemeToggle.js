// components/ThemeToggle.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { isDark, toggleTheme, colors } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.card }]}
            onPress={toggleTheme}
        >
            <Text style={[styles.text, { color: colors.text }]}>
                {isDark ? '☀️ Aydınlık Mod' : '🌙 Karanlık Mod'}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 16,
        marginVertical: 8,
    },
    text: {
        fontSize: 16,
    },
});

export default ThemeToggle;