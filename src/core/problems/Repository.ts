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
import { PgDialect, PgSelect } from 'drizzle-orm/pg-core'
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

        // const filters = this.getFilters(params)
        // function withOrder<T extends PgSelect>(qb: T, order: string) {
        //     if (order === 'asc') {
        //         return qb.orderBy(asc(qb.id))
        //     } else {
        //         return qb.orderBy(desc(qb.id))
        //     }
        // }

        const query = sql`
            SELECT
                "id",
                "uuid",
                "category_uuid",
                "name",
                "slug",
                "description",
                "starter_code",
                "answer_code",
                "difficulty",
                "course_id",
                "link",
                "image_uuid",
                "status",
                "is_deleted",
                "created_at",
                "updated_at",
                "is_seeded",
                "lastSubmitted",
                "category"
            FROM (
                SELECT
                    "problem"."id" AS "id",
                    "problem"."uuid",
                    "problem"."category_uuid",
                    "problem"."name",
                    "problem"."slug",
                    "problem"."description",
                    "problem"."starter_code",
                    "problem"."answer_code",
                    "problem"."difficulty",
                    "problem"."course_id",
                    "problem"."link",
                    "problem"."image_uuid",
                    "problem"."status",
                    "problem"."is_deleted",
                    "problem"."created_at",
                    "problem"."updated_at",
                    "problem"."is_seeded",
                    "category"."name" AS "category",
                    ROW_NUMBER() OVER (PARTITION BY problem.uuid ORDER BY submission.created_at DESC) AS "rowNumber",
                    "submission"."created_at" AS "lastSubmitted"
                FROM
                    "problem"
                LEFT JOIN "category" ON "problem"."category_uuid" = "category"."uuid"
                LEFT JOIN "media" ON "problem"."image_uuid" = "media"."uuid"
                LEFT JOIN "submission" ON "problem"."uuid" = "submission"."problem_uuid"
            GROUP BY
                "problem"."uuid",
                "category"."uuid",
                "media"."uuid",
                "submission"."created_at") "query"
            WHERE
                "rowNumber" = 1
            ORDER BY
                ${sql.raw(params.sortColumn)} ${sql.raw(params.order || 'asc')}
            OFFSET ${params.offset || DEFAULT_OFFSET}
            LIMIT ${params?.limit || DEFAULT_LIMIT}`
        // const pgDialect = new PgDialect()
        // const string = pgDialect.sqlToQuery(query)
        // console.log(string)
        // const query = db
        //     .select({
        //         id: sql`${this.table.id}`.as('id'),
        //         uuid: this.table.uuid,
        //         categoryUuid: this.table.categoryUuid,
        //         name: this.table.name,
        //         slug: this.table.slug,
        //         description: this.table.description,
        //         starterCode: this.table.starterCode,
        //         answerCode: this.table.answerCode,
        //         difficulty: this.table.difficulty,
        //         courseId: this.table.courseId,
        //         link: this.table.link,
        //         imageUuid: this.table.imageUuid,
        //         status: this.table.status,
        //         isDeleted: this.table.isDeleted,
        //         createdAt: this.table.createdAt,
        //         updatedAt: this.table.updatedAt,
        //         isSeeded: this.table.isSeeded,
        //         category: sql`${category.name}`.as('category'),
        //         rowNumber: sql`ROW_NUMBER() OVER(PARTITION BY problem.uuid ORDER BY submission.created_at DESC)`.as('rowNumber'),
        //         lastSubmission: sql`${submission.createdAt}`.as('lastSubmitted')
        //         // total: sql`(SELECT count(uuid)
        //         //         FROM ${this.table}
        //         //         WHERE store_uuid = ${params.storeId}
        //         //         AND is_archived = false)`.mapWith(Number),
        //     })
        //     .from(this.table)
        //     .leftJoin(category, eq(this.table.categoryUuid, category.uuid))
        //     .leftJoin(media, eq(this.table.imageUuid, media.uuid))
        //     .leftJoin(submission, eq(this.table.uuid, submission.problemUuid))
        //     // .orderBy(asc(query.id))
        //     // .limit(params?.limit || DEFAULT_LIMIT)
        //     .offset(params?.offset || DEFAULT_OFFSET)
        //     .groupBy(this.table.uuid, category.uuid, media.uuid, submission.createdAt)
        //     .where(and(...filters))
        //     .$dynamic()
        //     .as('query')



        // // console.log(query.toSQL())
        // // const sq = db.$with('sq').as(query);
        // console.log('creating final query')

        // const finalQuery = db.select({
        //     id: query.id,
        //     uuid: query.uuid,
        //     categoryUuid: query.categoryUuid,
        //     name: query.name,
        //     slug: query.slug,
        //     description: query.description,
        //     starterCode: query.starterCode,
        //     answerCode: query.answerCode,
        //     difficulty: query.difficulty,
        //     courseId: query.courseId,
        //     link: query.link,
        //     imageUuid: query.imageUuid,
        //     status: query.status,
        //     isDeleted: query.isDeleted,
        //     createdAt: query.createdAt,
        //     updatedAt: query.updatedAt,
        //     isSeeded: query.isSeeded,
        //     lastSubmission: query.lastSubmission,
        //     category: query.category

            
        // }).from(query).where(eq(query.rowNumber, 1) )
        // .orderBy(
        //     sql`category`
        // )
        // .limit(params?.limit || DEFAULT_LIMIT)
        // .$dynamic()

        // // asc(query[params.sortColumn] || query.id)
        // if (params?.order) {
        //     withOrder(finalQuery, params.order)
        // }


        // console.log(query.toSQL())
        const result = await db.execute(query)
        // console.log("SQL RESULT", result)




        if (params?.withSubmissions && params.userId) {
            const submissionRepository = new SubmissionRepository()

            for (let res of result.rows) {
                const items = await submissionRepository.fetchAll({
                    userId: params.userId,
                    problemId: res.uuid as string,
                    limit: 5
                })
                
                //@ts-ignore
                res.submissions = items
                //@ts-ignore
                res.submissionCount = await submissionRepository.fetchCount({
                    userId: params.userId,
                    problemId: res.uuid as string,
                })

            }
        }
        // console.log(result)

        // logger.info("SALLARY GALLERY", result);
        // // logger.info("SQL QUERY", query.toSQL());
        return mapResult<ModelEntity, any>(result.rows, this.mapToEntity)

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

        if ('category' in itemData) {
            const categoryRepository = new CategoryRepository()
            const category = categoryRepository.mapToEntity(
                itemData.category as CategoryTable
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
        if ('lastSubmitted' in item && typeof item.lastSubmitted !== 'undefined' && item.lastSubmitted) {
            Entity.lastSubmitted = item.lastSubmitted.toString()
        }
        if ('category' in item && typeof item.category !== 'undefined' && item.category) {
            Entity.categoryName = item.category.toString()
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
