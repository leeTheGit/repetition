'use client'

import Link from 'next/link'
import { useFormState } from 'react-dom'
import { useFormStatus } from 'react-dom'

import { signin } from '@/core/user/actions/signin'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import AuthFormError from '../components/AuthFormError'
import { useParams, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Terminal } from 'lucide-react'
import GoogleIcon from '@/components/auth/icons/google-icon'
import GithubIcon from '@/components/auth/icons/github-icon'
import {
    setAuthIntentCookie
} from '@/core/auth/actions/set-auth-intent-cookie'

export default function SignInClient({domain, subdomain}: {domain: string, subdomain: string}) {
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
            case 'no_user_for_google':
                error = "We don't have a user account for this type of signin.  Perhaps you signed up with another method?"
                break;
    
        }
    }

    const [state, formAction] = useFormState(signin, {
        error: '',
    })


    const github = () => {
        setGHlogin(true)
    }
    const google = () => {
        setGoglogin(true)
    }
   
    
    useEffect(() => {
        const setCookie = async () => {
            await setAuthIntentCookie('signin', subdomain)
        }
        setCookie()
    }, [])

    return (
        <main className="h-full w-full flex flex-col flex-wrap content-center justify-center overflow-hidden">

            <div className="mx-10 lg:mx-auto flex flex-col justify-center md:min-w-[400px] max-w-[430px] align-center ">
            {first && (
                <div className="max-w-lg mb-10">
                    <h1 className="text-2xl font-bold text-center">
                        You&apos;re now on your new domain, sign in to view your
                        dashboard
                    </h1>
                </div>
            )}

            {!first && (
                <h1 data-test="happy" className={`text-2xl font-bold text-center mb-10 ${ghLogin ? 'blur-[2px]' : ''}`}>
                    Sign in to your account{' '}
                </h1>
            )}

            {error && !ghLogin &&
                <Alert className="my-6 border-red-400 text-red-500">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle data-test="signin_error">Error signing in</AlertTitle>
                    <AlertDescription id="one" data-test="signing_error_message">{error}</AlertDescription>
                </Alert>
            }


            <AuthFormError state={state} />
            <form action={formAction} className={`${ghLogin ? 'blur-[2px]' : ''}`}>
                <Label htmlFor="email" className="text-muted-foreground" >
                    Email
                </Label>
                <Input name="email" id="email" type="email" required data-test="email" />
                <br />
                <Label htmlFor="password" className="text-muted-foreground">
                    Password
                </Label>
                <Input type="password" name="password" id="password" required data-test="password" />
                <br />
                <SubmitButton />
            </form>
            <div className="mt-4 text-sm text-center text-muted-foreground">
                <Link
                    href="/auth/forgot-password"
                    className={`text-accent-foreground underline hover:text-primary ${ghLogin ? 'blur-[2px]' : ''}`}
                >
                    Forgot your password?
                </Link>
            </div>

            <div className="mt-6 text-sm text-center text-muted-foreground">
                {!gogLogin && <a 
                    onClick={google}
                    className={cn(
                        buttonVariants({
                            variant: "secondary",
                        }),
                        "w-full"
                        )}
                    href={`http://${domain}/auth/google`}>
                        <GoogleIcon className="mr-2 h-5 w-5 text-white" />
                        Sign in with Google
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
                        Signing in with Google...
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
                    href={`http://${domain}/auth/github`}>
                        <GithubIcon className="mr-2 h-5 w-5" />
                        Sign in with GitHub
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
                    Logging in with Github...</div>
                }
            </div>
            
            <div className="mt-4 text-muted-foreground text-center text-sm">
                        Don&apos;t have an account?{' '}
                        <Link
                            href="/auth/signup"
                            className="text-white text-secondary-foreground underline"
                        >
                            Sign up
                        </Link>
                    </div>
            {/* <div className="mt-4 text-sm text-center text-muted-foreground">
                Don&apos;t have an account yet?{' '}
                <Link
                    href="/auth/signup"
                    className="text-accent-foreground underline hover:text-primary"
                >
                    Create an account
                </Link>
            </div> */}
        </div>
        </main>
    )
}

const SubmitButton = () => {
    const { pending } = useFormStatus()
    return (
        <Button className="w-full" type="submit" disabled={pending} data-test="login_button">
            Sign{pending ? 'ing' : ''} in with email
        </Button>
    )
}
