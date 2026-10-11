import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  isLight: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  isLight: false,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aurelia_theme') as ThemeMode;
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'dark';
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        localStorage.setItem('aurelia_theme', next);
      }
      return next;
    });
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'light') {
        root.classList.remove('dark');
        root.classList.add('light');
        document.body.style.backgroundColor = '#FAF8F5';
        document.body.style.color = '#1E1C18';
      } else {
        root.classList.remove('light');
        root.classList.add('dark');
        document.body.style.backgroundColor = '#090A0D';
        document.body.style.color = '#E8E6E3';
      }
    }
  }, [theme]);

  const isLight = theme === 'light';

  return (
    <ThemeContext.Provider value={{ theme, isLight, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
