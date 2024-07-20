import React, { useState, useEffect } from 'react'

export const useLocalStorage = <T>(key: string, initialValue: T) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.error(error)
            return initialValue
        }
    })

    const setValue = <T>(value: T) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value
            setStoredValue(valueToStore)
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        const handleStorageChange = () => {
            try {
                const item = window.localStorage.getItem(key)
                setStoredValue(item ? JSON.parse(item) : initialValue)
            } catch (error) {
                console.error(error)
            }
        }

        window.addEventListener('storage', handleStorageChange)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [key, initialValue])

    return [storedValue, setValue]
}

// const [token, setToken] = useLocalStorage("tokenName", "");
