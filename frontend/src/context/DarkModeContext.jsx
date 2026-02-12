import { createContext, useContext, useEffect, useState } from 'react';

const DarkModeContext = createContext();

export function useDarkMode() {
    const context = useContext(DarkModeContext);
    if (!context) {
        throw new Error('useDarkMode must be used within DarkModeProvider');
    }
    return context;
}

export function DarkModeProvider({ children }) {
    const [isDark, setIsDark] = useState(() => {
        // Check localStorage first
        const stored = localStorage.getItem('darkMode');
        if (stored !== null) {
            return stored === 'true';
        }
        // Fall back to system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        // Update HTML class for Tailwind dark mode
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        // Save to localStorage
        localStorage.setItem('darkMode', isDark.toString());
    }, [isDark]);

    const toggle = () => setIsDark((prev) => !prev);

    return (
        <DarkModeContext.Provider value={{ isDark, toggle }}>
            {children}
        </DarkModeContext.Provider>
    );
}
