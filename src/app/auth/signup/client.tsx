'use client'

import Link from 'next/link'
import { useFormState } from 'react-dom'
import { useFormStatus } from 'react-dom'
import Image from 'next/image'
import { signup } from '@/core/user/actions/signup'
import { useSession } from '@/providers/sessionProvider'
import { useRouter, useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import AuthFormError from '../components/AuthFormError'
import Overlay from '@/components/overlay'
import { useEffect, useState } from 'react'
import GoogleIcon from '@/components/auth/icons/google-icon'
import GithubIcon from '@/components/auth/icons/google-icon'
import {
    setAuthIntentCookie
} from '@/core/auth/actions/set-auth-intent-cookie'

// import HexBG from "../../components/HexBG";

export default function SignUpPage() {
    const session = useSession()

    const [state, formAction] = useFormState(signup, {
        error: '',
    })


    const searchParams = useSearchParams()
    const [ghLogin, setGHlogin] = useState(false)
    const [gogLogin, setGoglogin] = useState(false)

    let qparams: Record<string, string> = {}
    searchParams.forEach((value, key) => {
        qparams[key] = value
    })

    let first = false
    if ('newaccount' in qparams) {
        first = true
    }
    

    let error = ''
    if ('error' in qparams) {
        switch(qparams['error']) {
            case 'Missing_oauth_params':
                error = "Authorisation failed. Please navigate to the sign in page and try again"
                break;
            case 'Unauthorized':
                error = "Authorisation failed. Please navigate to the sign in page and try again"
                break;
            case'No_account':
                error = "We can't find a Github account for you. Are you sure you have it activated?"
                break;
            case 'Account_mismatch':
                error = "We can't find a Github account for you. Are you sure you have it activated?"
                break;
            case 'User_already_exists':
                error = "Account already exists, please sign in on your personal domain"
                break;
        }
    }

    const github = () => {
        setGHlogin(true)
    }
    const google = () => {
        setGoglogin(true)
    }


    useEffect(() => {
        const setCookie = async () => {
            await setAuthIntentCookie('signup', '')
        }
        setCookie()
    }, [])

    
    // focus visible #cbd5e1
    // label #94a3b8
    if (session?.user?.organisationUuid) {
        return <p>You are already signed in</p>
        // router.push(`/`)
    }

    return (
        <main className="h-full w-full flex flex-col flex-wrap content-center justify-center  overflow-hidden">
            <div className="w-full h-full grid grid-cols-[1fr_60px] sm:grid-cols-[1fr_300px] min-[720px]:grid-cols-[1fr_400px] xl:grid-cols-[1fr_700px]">
                <div className="mx-10 lg:mx-auto flex flex-col justify-center sm:min-w-[400px] max-w-[430px] align-center ">
                    <h1 className="mb-5 text-white text-2xl font-bold text-center">
                        Create your account
                    </h1>
                    <p className="text-sm text-gray-400">
                        Currently full access is by invitation only, however
                        that shouldn&apos;t stop you from creating an account
                        and taking a look around.
                    </p>

                    <AuthFormError state={state} />
                    <AuthFormError state={{error}} />

                    <form className="mt-6" action={formAction}>
                        <Label
                            htmlFor="email"
                            className="text-[#94a3b8] dark:text-muted-foreground"
                        >
                            Email
                        </Label>
                        <Input
                            className="bg-black border-[#1e293b] text-[#f8fafce6] ring-offset-[#cbd5e1]"
                            name="email"
                            type="email"
                            id="email"
                            required
                        />
                        <br />
                        <Label
                            htmlFor="password"
                            className="text-[#94a3b8] dark:text-muted-foreground"
                        >
                            Password
                        </Label>
                        <Input
                            className="bg-black border-[#1e293b] text-[#f8fafce6] ring-offset-[#cbd5e1]"
                            type="password"
                            name="password"
                            id="password"
                            required
                        />
                        <br />
                        <SubmitButton />
                    </form>

                    <div className="mt-6 text-sm text-center text-muted-foreground">
                        {!gogLogin && <a 
                            onClick={google}
                            className={cn(
                                buttonVariants({
                                    variant: "secondary",
                                }),
                                "w-full"
                                )}
                            href={`/auth/google`}>
                                <GoogleIcon className="mr-2 h-5 w-5 text-white" />
                                Sign up with Google
                            </a>
                        }
                        {gogLogin &&
                            <div
                                className={cn(
                                    buttonVariants({
                                        variant: "secondary",
                                    }),
                                    "w-full"
                                    )}
                                >
                                <GoogleIcon className="mr-2 h-5 w-5 text-white" />
                                Signing up with Google...
                            </div>
                        }
                    </div>


                    <div className="mt-6 text-sm text-center text-muted-foreground">
                        {!ghLogin && <a 
                            onClick={github}
                            className={cn(
                                buttonVariants({
                                    variant: "secondary",
                                }),
                                "w-full"
                                )}
                            href={`/auth/github`}>
                                <GithubIcon className="mr-2 h-5 w-5" />
                                Sign up with GitHub
                            </a>
                        }
                        {ghLogin &&
                            <div
                                className={cn(
                                    buttonVariants({
                                        variant: "secondary",
                                    }),
                                    "w-full"
                                    )}
                                >
                                <GithubIcon className="mr-2 h-5 w-5" />
                                Signing up with Github...
                            </div>
                        }
                    </div>
                    <div className="mt-4 text-muted-foreground text-center text-sm">
                        Have an account but no domain?{' '}
                        <Link
                            href="/auth/signin"
                            className="text-secondary-foreground underline text-white"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>

                <div className="bg-black relative zoom-continuous">
                    <Overlay className="absolute bg-opacity-30" />
                    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-70"></div>
                    {/* <Image
                        alt="Hero"
                        className="sm:block h-full w-full object-cover"
                        height={550}
                        src="https://elcyen-prod-storeuploads-tezkaofv.s3.ap-southeast-2.amazonaws.com/platform/li7827_something_simple_0132f3e0-09ab-4aa3-8f53-d65dfc82f6a7.png"
                        // src="https://elcyen-prod-storeuploads-tezkaofv.s3.ap-southeast-2.amazonaws.com/platform/rope_circle.png"
                        width={550}
                    /> */}
                </div>
            </div>
        </main>
    )
}

const SubmitButton = () => {
    const { pending } = useFormStatus()
    return (
        <Button
            className="w-full bg-[#f8fafce6] text-[#0f172a] hover:bg-[#f8fafce6]"
            type="submit"
            disabled={pending}
        >
            Sign{pending ? 'ing' : ''} up with email
        </Button>
    )
}
