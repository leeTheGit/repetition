'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useParams, usePathname } from 'next/navigation'
import Link from 'next/link'

import Overlay from '@/components/overlay'

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

const MainNav = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) => {
    const params = useParams()
    const pathname = usePathname()
    const routes = [
        {
            href: `/dashboard`,
            label: 'Overview',
            active: pathname === `/${params.storeId}`,
        },
        {
            label: 'Content',
            children: [
                {
                    label: 'Problems',
                    description: 'View problems',
                    href: `/problems`,
                    active: pathname.includes(`/problems`),
                },
                {
                    label: 'Courses',
                    description: 'Manage courses',
                    href: `/courses`,
                    active: pathname.includes(`/courses`),
                },
                {
                    label: 'Topics',
                    description: 'Divide your course into different topics',
                    href: `/topics`,
                    active: pathname.includes(`/topics`),
                },
                {
                    label: 'Collections',
                    description: 'Add your content to feeds you curate',
                    href: `/collections`,
                    active: pathname.includes(`/collections`),
                },
                {
                    label: 'Categories',
                    description: 'Group problems into categories',
                    href: `/categories`,
                    active: pathname.includes(`/categories`),
                },
            ],
            active: !!pathname.match(
                /(\/problems|\/collections|\/categories)/
            ),
            // active: pathname.includes(`/content`),
        },
        {
            label: 'Profile',
            href: `/profile`,
            active: pathname.includes(`/profile`),

            // href: `/${params.storeId}/users`,
            // children: [
            //     {
            //         label: 'Profile',
            //         description: 'Manage your profile.',
            //         href: `/${params.storeId}/users`,
            //     },
            //     {
            //         label: 'Roles and permissions',
            //         description:
            //             'Create and manage user roles and permissions for admin',
            //         href: `/${params.storeId}/users/roles`,
            //     },
            // ],
        },
        {
            // href: `/${params.storeId}/settings`,
            label: 'Settings',
            active: pathname.includes(`/settings`),
            children: [
                {
                    label: 'Organisation settings',
                    description: 'Account settings',
                    href: `/settings/account`,
                },
            ],
        },
    ]

    return (
        <NavigationMenu>
            <NavigationMenuList>
                {routes.map((route) => {
                    return (
                        <NavigationMenuItem key={route.label}>
                            {route.children && (
                                <React.Fragment key={route.label}>
                                    <NavigationMenuTrigger
                                        className={`focus:bg-buttonactive ${route.active ? 'bg-buttonactive' : ''}`}
                                    >
                                        {route.label}
                                    </NavigationMenuTrigger>

                                    <NavigationMenuContent className="dark:bg-black">
                                        {/* <Overlay /> */}
                                        <ul className="z-50 grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                            {route.children.map((child) => (
                                                <ListItem
                                                    key={child.href}
                                                    href={child.href}
                                                    title={child.label}
                                                >
                                                    {child.description}
                                                </ListItem>
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </React.Fragment>
                            )}

                            {route.href && (
                                <Link href={route.href} legacyBehavior passHref>
                                    <NavigationMenuLink
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            `focus:bg-buttonactive ${route.active ? 'bg-buttonactive' : ''}`
                                        )}
                                    >
                                        {route.label}
                                    </NavigationMenuLink>
                                </Link>
                            )}
                        </NavigationMenuItem>
                    )
                })}
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<'a'>,
    React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
    return (
        <>
            {/* <Overlay /> */}

            <li className="z-50">
                <NavigationMenuLink asChild>
                    <Link
                        href={props.href as string}
                        ref={ref}
                        className={cn(
                            'dark:bg-slate-900 block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                            className
                        )}
                        {...props}
                    >
                        <div className="text-sm font-medium leading-none">
                            {title}
                        </div>
                        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                            {children}
                        </p>
                    </Link>
                </NavigationMenuLink>
            </li>
        </>
    )
})
ListItem.displayName = 'ListItem'
export default MainNav
