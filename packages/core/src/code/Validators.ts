import { z } from 'zod'
import { Slugify } from '@repetition/core/lib/utils'


export const fetchParams = z
    .object({
        limit: z.coerce
            .number()
            .gte(1, { message: 'Must be a minumum of 1' })
            .lt(100, { message: 'Must be a maximum of 100' })
            .optional(),
        offset: z.coerce.number().gte(1).optional(),
        order: z.enum(['asc', 'desc']).optional(),
        name: z.string().trim().optional(),
        userId:z.string().uuid().optional(),
        // sortColumn: z.enum([]).optional(),
   })
    .optional()

export type FetchParams = z.infer<typeof fetchParams>

export const fetchByUuid = z.object({
    entityId: z.string().uuid().or(z.string().min(3).max(100)),
})





