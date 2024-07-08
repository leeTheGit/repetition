"use client";

import { useSearchParams } from 'next/navigation'
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMutation } from '@tanstack/react-query'
import { create } from '@/hooks/queries'
import {resetPassword, ResetPasswordSchema} from '@/core/auth/Validators'
const endpoint = "reset-password"


export default function ResetPasswordClient() {

    const searchParams = useSearchParams()
 
    const token = searchParams.get('token')

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPassword),
    defaultValues: {
      password: "",
      token: token || '',
      passwordConfirmation: "",
    },
  });

  const postQuery = useMutation({
    mutationFn: (data: ResetPasswordSchema) => {
        return create<ResetPasswordSchema>(
            data,
            'POST',
            `auth/${endpoint}`
        )
    },
    onSuccess: (response) => {
    },
    onError: () => {
        // toast.error(`${name} failed to save`)
    },
    onSettled: () => {
    },
})

  function onSubmit(values: ResetPasswordSchema) {
    postQuery.mutate(values)
  }


  if (!token) {
    return (
    <main className="h-full w-full flex flex-col flex-wrap content-center justify-center overflow-hidden">
        <div className="mx-10 lg:mx-auto flex flex-col justify-center md:min-w-[400px] max-w-[430px] align-center ">
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Uhoh, the token is missing from the url</AlertTitle>
                <AlertDescription>Try using the link sent to you email again</AlertDescription>
            </Alert>
        </div>
    </main>
  )
}


  return (
    <main className="h-full w-full flex flex-col flex-wrap content-center justify-center overflow-hidden">

    <div className="mx-10 lg:mx-auto flex flex-col justify-center md:min-w-[400px] max-w-[430px] align-center ">

        <>
          {postQuery.isSuccess && 
            <>
            <Alert className="my-6">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Password updated</AlertTitle>
                <AlertDescription>
                Your password has been successfully updated.
                </AlertDescription>
            </Alert>

            <Button variant="default" asChild className="w-full">
                <Link href="/auth/signin/">Login with New Password</Link>
            </Button>
            </>
        }
        </>

        <>

            

          {postQuery.isError &&
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Uhoh, something went wrong</AlertTitle>
              {/* <AlertDescription>{state.error}</AlertDescription> */}
            </Alert>
          }

        <Form {...form}>
          {!postQuery.isSuccess &&

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <h1 className="mb-5 text-white text-2xl font-bold text-center">
                    Choose a new password
                </h1>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        placeholder="Enter your new password"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passwordConfirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        placeholder="Enter Confirm your Password"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={postQuery.isPending}
                className="w-full"
                type="submit"
              >
                Change Password
              </Button>
            </form>
            }
            </Form>
        </>
    </div>
    </main>
  );
}
