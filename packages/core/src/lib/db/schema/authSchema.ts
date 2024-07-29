import { pgTable, text } from 'drizzle-orm/pg-core'
import { z } from 'zod'


export const authenticationSchema = z.object({
    email: z.string().email().min(5).max(31),
    password: z
        .string()
        .min(4, { message: 'must be at least 4 characters long' })
        .max(15, { message: 'cannot be more than 15 characters long' }),
})

export const updateUserSchema = z.object({
    name: z.string().min(3).optional(),
    email: z.string().min(4).optional(),
})

export type UsernameAndPassword = z.infer<typeof authenticationSchema>


export const mediaTable = pgTable('media', {
    uuid: text('uuid').primaryKey(),
    cdnUrl: text('cdn_url'),
})

export const userTable = pgTable('user', {
    id: text('uuid').primaryKey(),
    username: text('username'),
    email: text('email'),
    organisationUuid: text('organisation_uuid'),
    profileImageId: text('profile_image_id'),
    // avatar: text('avatar'),
})

export const orgTable = pgTable('organisation', {
    uuid: text('uuid').primaryKey(),
    name: text('name'),
    domain: text('domain'),
})