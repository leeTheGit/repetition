'use client'

import Link from 'next/link'
import { useFormState, useFormStatus } from 'react-dom'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import AuthFormError from '@/components/auth/AuthFormError'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPassword, ForgotPasswordSchema } from '@repetition/core/auth/Validators'
import { useMutation } from '@tanstack/react-query'
import { Delete, create } from '@/hooks/queries'
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Terminal } from 'lucide-react'

const endpoint = 'forgot-password'

export function ForgotPasswordClient() {
    document.body.classList.add('overflow-hidden')

    const form = useForm({
        resolver: zodResolver(forgotPassword),
        defaultValues: {
            email: "one@two.clom"
        },
    })

    const postQuery = useMutation({
        mutationFn: (data: ForgotPasswordSchema) => {

            return create<ForgotPasswordSchema>(
                data,
                'POST',
                `auth/${endpoint}`
            )
        },
        onSuccess: (response) => {
        },
        onError: () => {
            toast.error(`${name} failed to save`)
        },
        onSettled: () => {
        },
    })


    const onSubmit = async (data: ForgotPasswordSchema) => {
        postQuery.mutate(data)
    }

    return (
        <main className="h-full w-full flex flex-col flex-wrap content-center justify-center overflow-hidden">

                <div className="mx-10 lg:mx-auto flex flex-col justify-center md:min-w-[400px] max-w-[430px] align-center ">
                    {postQuery.isSuccess &&
                        <Alert className="my-6 border-cyan-400 text-cyan-500">
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>Nice</AlertTitle>
                            <AlertDescription>We&apos;ve sent a link to your email</AlertDescription>
                        </Alert>
                    }


                    {/* {state.error && <AuthFormError state={state} />} */}
                    {!postQuery.isSuccess &&
                        <Form {...form}>

                            <form className="mt-6" onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            {/* <FormLabel>Enter your email</FormLabel> */}
                                            <FormControl>
                                                <Input placeholder="Enter your email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />                            
                                <Button
                                    disabled={postQuery.isPending}
                                    className="mt-4 w-full bg-[#f8fafce6] text-[#0f172a] hover:bg-[#f8fafce6]"
                                    type="submit"
                                >
                                    Send reset password link
                                </Button>
                            </form>
                        </Form>
                    }
                    <div className="mt-4 text-muted-foreground text-center text-sm">
                        Wait, I remember now{' '}
                        <Link
                            href="/auth/signin"
                            className="text-white text-secondary-foreground underline"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
         </main>
    )

}

