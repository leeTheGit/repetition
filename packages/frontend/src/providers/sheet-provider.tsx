"use client"

import { useEffect, useState } from "react"


export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(()=> {
        setIsMounted(true)
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>  
        {/* <Sheet>
            <SheetTrigger> 
                <Button>Enable</Button>
            </SheetTrigger>
            <SheetContent className="bg-bglighter">
                <SheetHeader>
                    <SheetTitle>ReCAPTCHA</SheetTitle>
                    <SheetDescription>
                        reCAPTCHA is a free service from Google that helps protect websites from spam and abuse. 
                        A “CAPTCHA” is a turing test to tell human and bots apart. It is easy for humans to solve, 
                        but hard for “bots” and other malicious software to figure out. By adding reCAPTCHA to a site, 
                        you can block automated software while helping your welcome users to enter with ease.

                    </SheetDescription>
                </SheetHeader>

                <RecaptchaForm name="recaptcha" storeId={params.storeId} />
            
            
            </SheetContent>
        </Sheet> */}
        </>
    )
}