'use client'

import React from 'react'
import { useFormState } from 'react-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import { useSession } from '@/providers/sessionProvider'

import { signout } from '@/core/user/actions/signout'
import Link from 'next/link'


export const UserProfileButton = () => {
    const [state, formAction] = useFormState(signout, {
        error: '',
    })

    const session = useSession()

    const userId = session.user?.id

    return (
        <Popover>
            <Avatar>
                <PopoverTrigger>
                    <AvatarImage src={session.user?.avatar} />
                    <AvatarFallback>CN</AvatarFallback>
                </PopoverTrigger>
            </Avatar>
            <PopoverContent className="dark:bg-black">
                <form
                    action={formAction}
                    className="flex flex-col items-start space-y-2 "
                >
                    <Link
                        className="hover:dark:text-gray-400"
                        href={`/profile`}
                    >
                        Profile
                    </Link>
                    <button className="dark:hover:text-gray-400">
                        Sign out
                    </button>
                </form>
            </PopoverContent>
        </Popover>
    )
}
