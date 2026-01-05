import { createContext, useContext, useState } from 'react';

const themes = {
  dark: {
    // Your palette
    primary: '#061E29',
    secondary: '#1D546D',
    tertiary: '#5F9598',
    light: '#F3F4F4',
    
    // Backgrounds
    bgDark: '#061E29',
    bgMedium: '#0A2A38',
    bgLight: '#1D546D',
    
    // Text
    textPrimary: '#F3F4F4',
    textSecondary: '#5F9598',
    textDisabled: '#2A5A70',
    
    // Accents
    accent: '#5F9598',
    accentHover: '#7AB5B8',
    
    // Semantic
    success: '#5F9598',
    danger: '#D96459',
    warning: '#E8A87C',
    
    // Card colors (alternating)
    cardColor1: '#5F9598',
    cardColor2: '#1D546D'
  },
  
  light: {
    primary: '#F3F4F4',
    secondary: '#E8EEF0',
    tertiary: '#5F9598',
    dark: '#061E29',
    
    bgDark: '#FFFFFF',
    bgMedium: '#F3F4F4',
    bgLight: '#E8EEF0',
    
    textPrimary: '#061E29',
    textSecondary: '#1D546D',
    textDisabled: '#B0C4C8',
    
    accent: '#1D546D',
    accentHover: '#2A6B8A',
    
    success: '#5F9598',
    danger: '#D96459',
    warning: '#E8A87C',
    
    cardColor1: '#1D546D',
    cardColor2: '#5F9598'
  }
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('dark');
  
  const theme = themes[currentTheme];
  
  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, currentTheme, toggleTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}