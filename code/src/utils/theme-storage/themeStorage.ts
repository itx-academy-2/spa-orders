import { Theme, ThemeType } from '@/constants/theme';
import { LOCAL_STORAGE_KEYS } from "@/constants/common";

export const THEME_KEY = LOCAL_STORAGE_KEYS.theme;

export const getStoredTheme = (): ThemeType | null => {
    try {
        const stored = localStorage.getItem(THEME_KEY)
        if(stored === 'light' || stored === 'dark') {
            return stored as ThemeType;
        }
        return null;
    } catch {
        return null;
    }
};

export const setStoredTheme = (theme: ThemeType): void => {
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
        console.error("setStoredTheme error:", error)
    }
};

export const initializeTheme = (): ThemeType => {
    const storedTheme = getStoredTheme();
    if (storedTheme) {
        return storedTheme;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? Theme.Dark : Theme.Light;
};
