// contexts/ThemeContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const colorScheme = useColorScheme();
    const [isDark, setIsDark] = useState(colorScheme === 'dark');
    const [themeLoaded, setThemeLoaded] = useState(false);

    // Load saved theme preference from storage
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('themePreference');
                if (savedTheme !== null) {
                    setIsDark(savedTheme === 'dark');
                }
            } catch (error) {
                console.error('Failed to load theme preference:', error);
            } finally {
                setThemeLoaded(true);
            }
        };

        loadTheme();
    }, []);

    // Save theme preference to storage when it changes
    useEffect(() => {
        const saveTheme = async () => {
            try {
                await AsyncStorage.setItem('themePreference', isDark ? 'dark' : 'light');
            } catch (error) {
                console.error('Failed to save theme preference:', error);
            }
        };

        if (themeLoaded) {
            saveTheme();
        }
    }, [isDark, themeLoaded]);

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    const theme = {
        isDark,
        toggleTheme,
        colors: {
            background: isDark ? '#121212' : '#f1f5f9',
            card: isDark ? '#1e1e1e' : '#ffffff',
            text: isDark ? '#ffffff' : '#111111',
            subtitle: isDark ? '#bbbbbb' : '#555555',
            border: isDark ? '#333333' : '#cccccc',
            primary: '#2563eb',
            secondary: isDark ? '#e2e8f0' : '#e2e8f0',
            buttonText: isDark ? '#ffffff' : '#1e293b',
        },
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);