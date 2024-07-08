import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TanstackQueryClient } from "@/providers/query-client-provider";
import { validateRequest, validateSignup } from '@/lib/auth/validate'
import { SessionProvider } from '@/providers/sessionProvider'
import { logger } from '@/lib/logger'
import { redirect } from 'next/navigation'
import MainNav from '@/components/main-nav'
import Navbar from '@/components/Navbar'
import { ModeToggle } from '@/components/theme-toggle'
import { UserProfileButton } from '@/components/auth/user-profile-button'


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  const session = await validateRequest()
  if (!session.user) {
      return redirect('/auth/signin')
  }

  return (
    <html lang="en">
      <body className={inter.className}>
      
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TanstackQueryClient>
          <SessionProvider session={session}>

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
            </SessionProvider>
            </TanstackQueryClient>
        </ThemeProvider>

        <Toaster />      
      </body>
    </html>
  );
}
