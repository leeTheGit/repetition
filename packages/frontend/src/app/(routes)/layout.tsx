import React from 'react'
import { redirect } from 'next/navigation'
import { SessionProvider } from '@/providers/sessionProvider'
import { validateRequest } from '@repetition/core/lib/auth/validate'
import { TanstackQueryClient } from "@/providers/query-client-provider";
import MainNav from '@/components/main-nav'
import Navbar from '@/components/Navbar'
import { ModeToggle } from '@/components/theme-toggle'
import { UserProfileButton } from '@/components/auth/user-profile-button'


export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { storeId: string; domain: string }
}) {
    // logger.info('SITE ROOT LAYOUT', PLATFORM_DOMAIN)

    const session = await validateRequest()
    if (!session.user) {
        return redirect('/auth/signin')
    }

    return (
    <SessionProvider session={session}>

        <TanstackQueryClient>

            <Navbar>
                <MainNav className="mx-6" />
                {/* <Onboarding
                    storeId={params.storeId}
                    isNew={found.isNewStore}
                /> */}
                <div className=" flex items-center space-x-4">
                    {/* <StoreSwitcher items={objectStores} /> */}
                    <ModeToggle />
                    <UserProfileButton  />
                </div>
            </Navbar>

            {children}
        </TanstackQueryClient>

        
        </SessionProvider>
    )
}
