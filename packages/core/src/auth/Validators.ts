import { z } from 'zod'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { authTokens } from '@repetition/core/lib/db/schema/schema'
import { WithoutNullableKeys } from '../types'

export const fetchParams = z
    .object({
        limit: z.coerce
            .number()
            .gte(1, { message: 'Must be a minumum of 1' })
            .lt(100, { message: 'Must be a maximum of 100' })
            .optional(),
        offset: z.coerce.number().gte(1).optional(),
        order: z.enum(['asc', 'desc']).optional(),
        organisationUuid: z.string().uuid().optional(),
        storeId: z.string().optional(),
        withIdentity: z.boolean().optional(),
    })
    .optional()

export type FetchParams = z.infer<typeof fetchParams>

export const forgotPassword = z.object({
    email: z.string().email().nullable()
})
export type ForgotPasswordSchema = z.infer<typeof forgotPassword>

export const resetPassword = z
  .object({
    password: z.string().min(8),
    token: z.string(),
    passwordConfirmation: z.string().min(8),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });

export type ResetPasswordSchema = z.infer<typeof resetPassword>


export const fetchById = z.object({
    entityId: z.coerce.number(),
})

export const entitySchema = createSelectSchema(authTokens)
export type EntitySchema = z.infer<typeof entitySchema>

export const insertSchema = createInsertSchema(authTokens, {
    expiresAt: z.preprocess((val) => {
        if (!val || typeof val !== 'string') return null
        return val.trim()
    }, z.string().uuid().nullable()),
}).omit({
    id: true,
    createdAt: true,
})
export type InsertSchema = z.infer<typeof insertSchema>

export const apiInsertSchema = insertSchema.omit({
    organisationUuid: true,
    storeUuid: true,
    identifier: true,
})
export type ApiInsertSchema = z.infer<typeof apiInsertSchema>

export const patchSchema = createInsertSchema(authTokens).partial()

export type PatchSchema = z.infer<typeof patchSchema>

export type FormSchema = WithoutNullableKeys<InsertSchema>
