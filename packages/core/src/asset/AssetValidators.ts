import { z } from 'zod'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { media } from '@repetition/core/lib/db/schema/schema'
import { NoUndefinedField } from '@repetition/core/types'

export const fetchParams = z
    .object({
        limit: z.coerce
            .number()
            .gte(1, { message: 'Must be a minumum of 1' })
            .lt(100, { message: 'Must be a maximum of 100' })
            .optional(),
        offset: z.coerce.number().optional(),
        organisation: z.string().optional(),
        storeId: z.string().uuid().optional(),
        organisationId: z.string().uuid().optional(),
    })
    .optional()

export type FetchParams = z.infer<typeof fetchParams>

// export const authUser = createSelectSchema(users).pick({ id: true, username: true, email: true});
// export const userValidator = createInsertSchema(users).omit({ id: true, uuid: true, createdAt: true, updatedAt: true });

const contentType = z.union([
    z.literal('image/png'),
    z.literal('image/jpeg'),
    z.literal('image/jpg'),
    z.literal('image/webp'),
    z.literal('image/svg+xml'),
])

const baseEntitySchema = createSelectSchema(media)
export const entitySchema = baseEntitySchema
export type EntitySchema = z.infer<typeof entitySchema>

export const basePostSchema = createInsertSchema(media).omit({
    id: true,
    uuid: true,
    organisationUuid: true,
    createdAt: true,
    updatedAt: true,
    cdnUrl: true,
    storageUrl: true,
    filename: true,
    filesize: true,
    filetype: true,
})

export const miniFormSchema = createInsertSchema(media).pick({
    title: true,
    caption: true,
    altText: true,
})
export type FormSchema = NoUndefinedField<z.infer<typeof basePostSchema>>

export const postParams = z.object({
    url: z.string().max(300),
    entity: z.string().nullable().optional(),
    entityAttribute: z.string().nullable().optional(),
    entity_uuid: z.string().nullable().optional(),
    title: z.string().min(1).max(255).optional(),
    type: z.string(),
    width: z.number().min(1).optional(),
    height: z.number().min(1).optional(),
    name: z.string().min(1).max(255).optional(),
    copyright: z.string().optional(),
    source: z.string().optional(),
    private: z.boolean().default(false),
    filetype: contentType,
    caption: z.string().optional(),
    altText: z.string().optional(),
    description: z.string().optional(),
    filesize: z.number().min(1),
    filename: z.string().min(1).max(255),
    tags: z.string().optional(),
    assetType: z.union([z.literal('image'), z.literal('video')]),
})

export type PostParams = z.infer<typeof postParams>

export const patchParams = basePostSchema.partial()
export type PatchParams = z.infer<typeof patchParams>
export const urlParams = z.object({
    name: z.string().min(1).max(255),
    // storeId: z.string().min(1).max(36),
    type: contentType,
})
export type UrlParams = z.infer<typeof urlParams>
