import { db } from '@repetition/core/lib/db'
import { course, media } from '@repetition/core/lib/db/schema/schema'
import {
    eq,
    desc,
    asc,
    or,
    and,
    inArray,
    sql,
    ilike,
    SQL,
} from 'drizzle-orm'
import { FetchParams } from '@repetition/core/course/Validators'
import { ModelError, isError } from '@repetition/core/types'
import { CourseEntity as ModelEntity } from '@repetition/core/course/Entity'
import { alias, PgDialect, PgSelect } from 'drizzle-orm/pg-core'
import CategoryRepository, {
    SelectTableType as CategoryTable,
} from '@repetition/core/category/Repository'
import BaseRepository from '@repetition/core/baseRepository'
import AssetRepository, {
    TableType as AssetTable,
} from '@repetition/core/asset/AssetRepository'
import { uuidRegex, mapResult } from '@repetition/core/lib'
import { logger } from '@repetition/core/lib/logger'

export type TableType = typeof course.$inferSelect & {
    image?: {
        cdnUrl: string
    } | null
}
export type CreateTableType = Omit<
    typeof course.$inferInsert,
    'id' | 'uuid' | 'createdAt' | 'updatedAt'
>

const DEFAULT_LIMIT = 50
const DEFAULT_OFFSET = 0

class Repository extends BaseRepository<
    typeof course,
    ModelEntity,
    TableType
> {
    constructor() {
        super(course, 'Course')
    }
    getFilters(params: FetchParams) {
        const filters: any = []

        if (params?.name) {
            filters.push(ilike(this.table.name, `%${params.name}%`))
        }



        return filters
    }

    async fetchAll(params: FetchParams = {}): Promise<ModelEntity[]> {
        var self = this

        function withOrder<T extends PgSelect>(qb: T, order: string) {
            if (order === 'asc') {
                return qb.orderBy(asc(self.table.id))
            } else {
                return qb.orderBy(desc(self.table.id))
            }
        }

        const filters: any = []
        const courseImage = alias(media, 'courseImage')
        const query = db
            .select({
                id: self.table.id,
                uuid: self.table.uuid,
                organisationUuid: self.table.organisationUuid,
                userId: self.table.userId,
                name: self.table.name,
                slug: self.table.slug, 
                description: self.table.description,
                imageUuid: self.table.imageUuid,
                status: self.table.status,
                isSeeded: self.table.isSeeded,
                createdAt: self.table.createdAt,
                updatedAt: self.table.updatedAt,
                courseImage
            })
            .from(this.table)
            .leftJoin(
                courseImage,
                eq(self.table.imageUuid, courseImage.uuid)
            )
            .where(and(...filters))
            .limit(params?.limit || DEFAULT_LIMIT)
            .offset(params?.offset || DEFAULT_OFFSET)
            .orderBy(desc(this.table.createdAt))
            .$dynamic()

        if (params?.order) {
            await withOrder(query, params.order)
        }

        const result = await query

        return mapResult<ModelEntity, any>(result, this.mapToEntity)
    }


    async fetchCount(params: FetchParams): Promise<number> {
        let count = 0
        const filters = this.getFilters(params)

        const query = db
            .select({ count: sql`COUNT(*)`.mapWith(Number) })
            .from(this.table)
            .where(and(...filters))

        const [result] = await query

        if (result.count) {
            count = result.count
        }

        return count
    }

    async fetchByUuid(
        identifier: string,
        params: FetchParams = {}
    ): Promise<ModelEntity | ModelError> {
        let uuid = false
        var filters = [eq(this.table.slug, identifier)]
        if (identifier.match(uuidRegex)) {
            uuid = true
            filters = [eq(this.table.uuid, identifier)]
        }


        const query = db.query.course.findFirst({
            where: and(...filters),
            with: {
                courseImage: true,
            },
        })


        const data = await query
        if (!data) {
            return {
                error: `${this.tableName} not found`,
            }
        }
        const entity = this.mapToEntity(data)
        if (isError(entity)) {
            return entity
        }

        return entity
    }



    handleConstraints(e: any, entity?: ModelEntity) {
        if (e.constraint === 'product_category_uuid_category_uuid_fk') {
            return {
                error: 'Cannot delete category as it has associated products',
            }
        }
        if (e.constraint === 'category_slug_idx' && entity) {
            entity.uniqueSlug()
            return this.save(entity)
        }

        // if (e.constraint === "order_item_product_uuid_product_uuid_fk") {
        //   return {
        //     error: "Cannon delete product as it has associated orders",
        //   };
        // }
    }


    mapToEntity(item: TableType) {
        const itemData = convertCase(item)
        if (itemData.createdAt) {
            itemData.createdAt = new Date(itemData.createdAt)
        }
        if (itemData.updatedAt) {
            itemData.updatedAt = new Date(itemData.updatedAt)
        }
        const Entity = ModelEntity.fromValues(itemData, item.uuid)

        if (isError(Entity)) {
            return Entity
        }


        if ('courseImage' in item && item.courseImage !== null) { 
            const assetRepository = new AssetRepository()
            const galleryItem = assetRepository.mapToEntity(
                item.courseImage as AssetTable
            )
            if (!isError(galleryItem)) {
                Entity.courseImage = galleryItem
            }
        }

        return Entity
    }



}


function convertCase(obj: any) {
    const result: Record<string, string> = {}
    const camelCaseColumns: Record<string, string> = {
        category_uuid :'categoryUuid',
        course_id : 'courseId',
        starter_code:'starterCode',
        answer_code:'answerCode', 
        is_deleted: 'isDeleted',
        image_uuid: 'imageUuid', 
        is_seeded: 'isSeeded', 
        created_at: 'createdAt',
        updated_at: 'updatedAt',
        // submission_count: 'submissionCount',
        last_submission: 'lastSubmission'
    }

    for (let [key, value] of Object.entries(camelCaseColumns)) {
        if (typeof obj[key] !== 'undefined') {
            result[value] = obj[key]
            delete obj[key]
        }
    }
    return { ...obj, ...result }
}


export default Repository
