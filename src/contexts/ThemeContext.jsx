import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('portfolio-theme')
    if (savedTheme === 'fun' || savedTheme === 'serious') {
      return savedTheme
    }
    // Default to serious
    return 'serious'
  })

  useEffect(() => {
    // Save theme preference to localStorage whenever it changes
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'fun' ? 'serious' : 'fun')
  }

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isFun: theme === 'fun',
    isSerious: theme === 'serious'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
