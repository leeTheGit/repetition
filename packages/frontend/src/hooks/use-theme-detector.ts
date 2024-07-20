import { useEffect, useState } from 'react'

export const useThemeDetector = () => {
    const getCurrentTheme = () =>
        window.matchMedia('(prefers-color-scheme: dark)').matches
    const [isDarkTheme, setIsDarkTheme] = useState(getCurrentTheme())
    const mqListener = (e: any) => {
        setIsDarkTheme(e.matches)
    }

    useEffect(() => {
        const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)')
        darkThemeMq.addEventListener('theme', mqListener)
        return () => darkThemeMq.removeEventListener('theme', mqListener)
    }, [])
    return isDarkTheme
}
