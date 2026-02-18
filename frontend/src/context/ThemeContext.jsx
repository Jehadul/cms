import { createContext, useContext, useState, useEffect } from 'react';
import { themes } from './themes';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState('blue');

    useEffect(() => {
        const themeVariables = themes[currentTheme];
        const root = document.documentElement;

        for (const [key, value] of Object.entries(themeVariables)) {
            root.style.setProperty(key, value);
        }
    }, [currentTheme]);

    return (
        <ThemeContext.Provider value={{ currentTheme, setCurrentTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
};
