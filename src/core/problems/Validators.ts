import { z } from 'zod'
import { Slugify } from '@/lib/utils'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { problem } from '@/lib/db/schema/schema'

function transformer(problem: any, action?: string) {
    const result: any = {}
    if (action === 'post') {
        if (!problem.slug && problem.name) {
            result['slug'] = Slugify(problem.name)
        }
    }
    if (typeof problem.category_uuid !== 'undefined') {
        result['categoryUuid'] = problem.category_uuid
        delete problem.category_uuid
    }

    if (typeof problem.is_archived !== 'undefined') {
        result['isArchived'] = problem.is_archived
        delete problem.is_archived
    }

    return { ...problem, ...result }
}

export const fetchParams = z
    .object({
        limit: z.coerce
            .number()
            .gte(1, { message: 'Must be a minumum of 1' })
            .lt(100, { message: 'Must be a maximum of 100' })
            .optional(),
        offset: z.coerce.number().gte(1).optional(),
        order: z.enum(['asc', 'desc']).optional(),
        categoryUuid: z.string().uuid().optional(),
        category: z.string().optional(),
        name: z.string().trim().optional(),
        course:z.string().uuid().optional(),
        userId:z.string().uuid().optional(),
        sortColumn: z.enum(["category", "last_practiced", "grade"]).optional(),
        withSubmissions:z
            .string()
            .toLowerCase()
            .transform((x) => x === 'true')
            .pipe(z.boolean())
            .optional(),
        isFeatured: z
            .string()
            .toLowerCase()
            .transform((x) => x === 'true')
            .pipe(z.boolean())
            .optional(),
        isArchived: z
            .string()
            .toLowerCase()
            .transform((x) => x === 'true')
            .pipe(z.boolean())
            .optional(),
    })
    .optional()
    .transform((problem) => transformer(problem, 'get'))

export type FetchParams = z.infer<typeof fetchParams>

export const fetchProductUuid = z.object({
    entityId: z.string().uuid().or(z.string().min(3).max(100)),
})


// export const fetchByUuid = z.object({
//     entityId: z.string().uuid(),
// })

// export const fetchBySlug = z.object({
//     entityId: z.string().min(3).max(100),
// })


export const entitySchema = createSelectSchema(problem)

export type EntitySchema = z.infer<typeof entitySchema>

// Columns that the database adds automatically are omitted
export const insertSchema = createInsertSchema(problem).omit({
    id: true,
    uuid: true,
    createdAt: true,
    updatedAt: true,
})
export type InsertSchema = z.infer<typeof insertSchema>

// Columns that the server side API adds are omitted
export const baseApiInsertSchema = insertSchema
    .omit({
        slug: true,
    })
    .merge(
        z.object({
            // collectionIds: z.preprocess((items: any) => {
            //     return items.map((item: { label: string; value: string }) => {
            //         // in the form this will be an object but on the server this will be a string
            //         if (typeof item !== 'string') return item.value
            //         return item
            //     })
            // }, z.array(z.string().uuid().optional())),

            name: z.preprocess(
                (name) => {
                    if (!name || typeof name !== 'string') {
                        return null
                    }
                    return name.trim()
                },
                z
                    .string({
                        invalid_type_error: 'Problem must include a name',
                    })
                    .min(3, 'Problem must include a name')
                    .max(100)
            ),
        })
    )
export const apiInsertSchema = baseApiInsertSchema
     .transform((schema) => transformer(schema, 'post'))
export type ApiInsertSchema = z.infer<typeof apiInsertSchema>
// export type FormSchema = WithoutNullableKeys<InsertSchema>
export type FormSchema = InsertSchema

// export const patchSchema = createInsertSchema(product).partial()
export const patchSchema = baseApiInsertSchema.partial()
export type PatchSchema = z.infer<typeof patchSchema>
