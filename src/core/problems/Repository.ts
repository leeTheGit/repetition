import { db } from '@/lib/db'
import { problem, category, media, submission } from '@/lib/db/schema/schema'
import {
    eq,
    desc,
    asc,
    or,
    and,
    inArray,
    sql,
    ilike,
} from 'drizzle-orm'
import { FetchParams } from '@/core/problems/Validators'
import { ModelError, isError } from '@/core/types'
import { ProblemEntity as ModelEntity } from '@/core/problems/Entity'
import { PgSelect } from 'drizzle-orm/pg-core'
import { SubmissionEntity } from '@/core/submission/Entity'
import CategoryRepository, {
    SelectTableType as CategoryTable,
} from '@/core/category/Repository'
import SubmissionRepository, {
    TableType as SubmissionTable,
} from '@/core/submission/Repository'
import BaseRepository from '@/core/baseRepository'
import AssetRepository, {
    TableType as AssetTable,
} from '@/core/asset/AssetRepository'
import { uuidRegex, mapResult } from '@/lib'
import { logger } from '@/lib/logger'

export type TableType = typeof problem.$inferSelect & {
    image?: {
        cdnUrl: string
    } | null
    submissions?:SubmissionEntity[],
    submissionCount?:number
}
export type CreateTableType = Omit<
    typeof problem.$inferInsert,
    'id' | 'uuid' | 'createdAt' | 'updatedAt'
>

const DEFAULT_LIMIT = 50
const DEFAULT_OFFSET = 0

class Repository extends BaseRepository<
    typeof problem,
    ModelEntity,
    TableType
> {
    constructor() {
        super(problem, 'Problem')
    }
    getFilters(params: FetchParams) {
        const filters: any = []

        if (params?.name) {
            filters.push(ilike(this.table.name, `%${params.name}%`))
        }

        if (params?.category) {
            const nameFilters = params.category
                .split(',')
                .map((name: string) => {
                    return eq(category.slug, name)
                })
            filters.push(or(...nameFilters))
        }

        if (params?.categoryUuid) {
            filters.push(eq(this.table.categoryUuid, params.categoryUuid))
        }

        if (params?.course) {
            filters.push(eq(this.table.courseId, params.course))
        }


        if (typeof params?.problemUuids !== 'undefined') {
            filters.push(inArray(this.table.uuid, params.problemUuids))
        }

        return filters
    }

    async fetchAll(params: FetchParams): Promise<ModelEntity[]> {
        var self = this

        const filters = this.getFilters(params)
        function withOrder<T extends PgSelect>(qb: T, order: string) {
            if (order === 'asc') {
                return qb.orderBy(asc(self.table.id))
            } else {
                return qb.orderBy(desc(self.table.id))
            }
        }

        const query = db
            .select({
                id: this.table.id,
                uuid: this.table.uuid,
                categoryUuid: this.table.categoryUuid,
                name: this.table.name,
                slug: this.table.slug,
                description: this.table.description,
                starterCode: this.table.starterCode,
                answerCode: this.table.answerCode,
                difficulty: this.table.difficulty,
                courseId: this.table.courseId,
                link: this.table.link,
                imageUuid: this.table.imageUuid,
                status: this.table.status,
                isDeleted: this.table.isDeleted,
                createdAt: this.table.createdAt,
                updatedAt: this.table.updatedAt,
                isSeeded: this.table.isSeeded,
                category,
                media,
                // total: sql`(SELECT count(uuid)
                //         FROM ${this.table}
                //         WHERE store_uuid = ${params.storeId}
                //         AND is_archived = false)`.mapWith(Number),
            })
            .from(this.table)
            .leftJoin(category, eq(this.table.categoryUuid, category.uuid))
            .leftJoin(media, eq(this.table.imageUuid, media.uuid))
            .limit(params?.limit || DEFAULT_LIMIT)
            .offset(params?.offset || DEFAULT_OFFSET)
            .groupBy(this.table.uuid, category.uuid, media.uuid)
            .orderBy(desc(this.table.id))
            .where(and(...filters))
            .$dynamic()


        if (params?.order) {
            withOrder(query, params.order)
        }

        const result = await query

        if (params?.withSubmissions && params.userId) {
            const submissionRepository = new SubmissionRepository()

            for (let res of result) {
                const items = await submissionRepository.fetchAll({
                    userId: params.userId,
                    problemId: res.uuid,
                    limit: 5
                })
                // console.log("suns", items)
                //@ts-ignore
                res.submissions = items
                //@ts-ignore
                res.submissionCount = await submissionRepository.fetchCount({
                    userId: params.userId,
                    problemId: res.uuid,
                })

            }
        }
        // console.log(result)

        // logger.info("SALLARY GALLERY", result);
        // // logger.info("SQL QUERY", query.toSQL());
        return mapResult<ModelEntity, any>(result, this.mapToEntity)

        // return {
        //     total: result.length > 0 ? result[0].total : 0,
        //     data: mapResult<ModelEntity, any>(result, this.mapToEntity)
        // };
    }

    async fetchCount(params: FetchParams): Promise<number> {
        let count = 0
        const filters = this.getFilters(params)

        const query = db
            .select({ count: sql`COUNT(*)`.mapWith(Number) })
            .from(this.table)
            .leftJoin(category, eq(this.table.categoryUuid, category.uuid))
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


        const query = db.query['problem'].findFirst({
            where: and(...filters),
        })

        // console.log("SQL QUERY", query.toSQL());

        const data = await query
        if (!data) {
            return {
                error: `${this.tableName} not found`,
            }
        }
        // console.log('repos', data)
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
        const Entity = ModelEntity.fromValues(item, item.uuid)
        if (isError(Entity)) {
            return Entity
        }

        if ('category' in item) {
            const categoryRepository = new CategoryRepository()
            const category = categoryRepository.mapToEntity(
                item.category as CategoryTable
            )
            if (!isError(category)) {
                Entity.category = category
            }
        }

        // if ('media' in item) {
        //     const assetRepository = new AssetRepository()
        //     const galleryItem = assetRepository.mapToEntity(
        //         item.media as AssetTable
        //     )
        //     if (!isError(galleryItem)) {
        //         Entity.image = galleryItem
        //     }
        // }
        if ('submissions' in item && typeof item.submissions !== 'undefined') {
            Entity.submissions = item.submissions
        }
        if ('submissionCount' in item && typeof item.submissionCount !== 'undefined') {
            Entity.submissionCount = item.submissionCount
        }
        console.log(Entity) 
        return Entity
    }
}

export default Repository
