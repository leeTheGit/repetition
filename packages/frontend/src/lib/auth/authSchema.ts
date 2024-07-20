import { z } from 'zod'
import { sessionTable, users } from '@repetition/core/lib/db/schema/schema'
import { pgTable, text } from 'drizzle-orm/pg-core'
// const userTable = pgTable("user", {
//     id: text("uuid").primaryKey(),
//     username: text("username"),
//     email: text("email"),
// });

// export const sessions = pgTable("session", {
//     id: text("id").notNull().primaryKey(),
//     userId: text("user_id")
//     .notNull()
//     .references(() => users.id),
//     expiresAt: integer("expires_at").notNull(),
// });

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
