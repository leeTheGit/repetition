"use client"
 
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
 
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {

    // const [isMounted, setMounted] = React.useState(false);

    // React.useEffect(() => {
    //     console.log('in the theme provider')
    //     setMounted(true);
    // }, []);

    // if (!isMounted) {
    //     return null;
    // }


    return <NextThemesProvider {...props}>{children}</NextThemesProvider>

}
