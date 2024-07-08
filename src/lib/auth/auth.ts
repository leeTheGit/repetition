// src/auth.ts
import { Lucia } from 'lucia'
import { GitHub, Google } from "arctic";
// import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { DrizzlePostgreSQLAdapter } from './postgresql'
import { db } from '@/lib/db'
import { sessionTable, users } from '@/lib/db/schema/schema'
import { pgTable, text } from 'drizzle-orm/pg-core'
import { Resource } from "sst";

export const SIGNUP_SESSION_NAME = 'signup_session'

const mediaTable = pgTable('media', {
    uuid: text('uuid').primaryKey(),
    cdnUrl: text('cdn_url'),
})

const userTable = pgTable('user', {
    id: text('uuid').primaryKey(),
    username: text('username'),
    email: text('email'),
    organisationUuid: text('organisation_uuid'),
    profileImageId: text('profile_image_id'),
    // avatar: text('avatar'),
})

const orgTable = pgTable('organisation', {
    uuid: text('uuid').primaryKey(),
    name: text('name'),
    domain: text('domain'),
})

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

export const signupLucia = new Lucia(adapter, {
    sessionCookie: {
        name: SIGNUP_SESSION_NAME,
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
            avatar: '',
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
