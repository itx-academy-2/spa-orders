import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode
} from 'react';

import { Theme, ThemeType } from '@/constants/theme';

import { setStoredTheme, initializeTheme } from '@/utils/theme-storage/themeStorage';

type ThemeContextType = {
    theme: ThemeType;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<ThemeType>(Theme.Light);

    useEffect(() => {
        const theme = initializeTheme();
        setTheme(theme);
        document.documentElement.setAttribute('data-theme', theme);
        setStoredTheme(theme);
    }, []);


    const toggleTheme = () => {
        const newTheme: ThemeType = theme === Theme.Light ? Theme.Dark : Theme.Light;
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        setStoredTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
};
