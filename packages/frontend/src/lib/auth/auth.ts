// src/auth.ts
import { Lucia } from 'lucia'
import { GitHub, Google } from "arctic";
// import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { DrizzlePostgreSQLAdapter } from '@repetition/core/lib/auth/postgresql'
import { db } from '@repetition/core/lib/db'
import { sessionTable, users } from '@repetition/core/lib/db/schema/schema'
import {mediaTable, userTable, orgTable} from '@repetition/core/lib/db/schema/authSchema'
import { Resource } from "sst";


const adapter = new DrizzlePostgreSQLAdapter(
    db,
    sessionTable,
    userTable,
    orgTable,
    mediaTable
) // your adapter

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        
        // this sets cookies with super long expiration
        // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
        // expires: false,
        attributes: {
            sameSite: 'lax',
            // secure: true
            secure: process.env.NODE_ENV === 'production',
        },
    },
    getUserAttributes: (attributes) => {
        return {
            username: attributes.username,
            email: attributes.email,
            githubId: attributes.github_id,
            organisationUuid: attributes.organisationUuid,
            avatar: attributes.avatar || 'https://github.com/shadcn.png',
        }
    },
})

 
export const github = new GitHub(
    process.env.GITHUB_CLIENT_ID!,
    process.env.GITHUB_CLIENT_SECRET!,

    // Resource.GithubClientId.value,
    // Resource.GithubClientSecret.value,
);

export const googleAuth = new Google(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,

    // Resource.GoogleClientId.value,
    // Resource.GoogleClientSecret.value,
    `http://${process.env.PLATFORM_DOMAIN}/auth/google/callback`
);

// IMPORTANT!
declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia
        DatabaseUserAttributes: DatabaseUserAttributes
    }
}

interface DatabaseUserAttributes {
    username: string
    email: string
    github_id: string
    organisationUuid: string
    avatar: string
}

export type Session = typeof sessionTable.$inferSelect
export type User = {
    id: string
    username: string
    email: string
    organisationUuid: string
    avatar: string
}

export interface SessionData {
    user: User | null
    session: Session | null
}
