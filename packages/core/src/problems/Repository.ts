import { db } from '@repetition/core/lib/db'
import { problem, category, media } from '@repetition/core/lib/db/schema/schema'
import { PostgresMapper } from '@repetition/core/problems/mappers/postgresMapper'

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
import { FetchParams } from '@repetition/core/problems/Validators'
import { ModelError, isError } from '@repetition/core/types'
import { ProblemEntity as ModelEntity } from '@repetition/core/problems/Entity'
import { PgDialect, PgSelect } from 'drizzle-orm/pg-core'
import { SubmissionEntity } from '@repetition/core/submission/Entity'
import CategoryRepository, {
    SelectTableType as CategoryTable,
} from '@repetition/core/category/Repository'
import SubmissionRepository, {
    TableType as SubmissionTable,
} from '@repetition/core/submission/Repository'
import BaseRepository from '@repetition/core/baseRepository'
// import AssetRepository, {
//     TableType as AssetTable,
// } from '@repetition/core/asset/AssetRepository'
import { uuidRegex, mapResult } from '@repetition/core/lib'
// import { logger } from '@repetition/core/lib/logger'

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

    private mapToEntity = PostgresMapper

    constructor() {
        super(problem, 'Problem')
    }


    set mapper(mapper: (item: TableType ) => ModelEntity | ModelError ) {
        this.mapToEntity = mapper
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
        let sortColumn = "created_at"
        if (params.sortColumn) {
            if (params.sortColumn === "last_practiced") {
                sortColumn = '"query"."lastSubmitted"'
            }
            if (params.sortColumn === "grade") {
                sortColumn = '"query"."lastGrade"'
            }
            if (params.sortColumn === "category") {
                sortColumn = '"query"."category"'
            }

        }

        let search = ''
        if (params.name) {
            search = '%' + params.name.toLowerCase() + '%'
            delete params.offset
        }

        let category
        if (params.category) {
            category = params.category
            delete params.offset
        }

        // this value is validated by Zod but should be validated again
        const order = params.order || "asc"

        const sqlChunks: SQL[] = [];
        sqlChunks.push(sql`
            SELECT
                "id",
                "uuid",
                "category_uuid",
                "topic_id",
                "name",
                "slug",
                "description",
                "starter_code",
                "test_code",
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
                "lastGrade",
                "category"
            FROM (
                SELECT
                    "problem"."id" AS "id",
                    "problem"."uuid",
                    "problem"."category_uuid",
                    "problem"."topic_id",
                    "problem"."name",
                    "problem"."slug",
                    "problem"."description",
                    "problem"."starter_code",
                    "problem"."test_code",
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
                    ROW_NUMBER() OVER (PARTITION BY problem.uuid ORDER BY submission.grade ASC) AS "grade",
                    "submission"."submitted_at" AS "lastSubmitted",
                    "submission"."grade" as "lastGrade"
                FROM
                    "problem"
                LEFT JOIN "category" ON "problem"."category_uuid" = "category"."uuid"
                LEFT JOIN "media" ON "problem"."image_uuid" = "media"."uuid"
                LEFT JOIN "submission" ON "problem"."uuid" = "submission"."problem_uuid" and "submission"."user_uuid" = ${params.userId}
            
            GROUP BY
                "problem"."uuid",
                "category"."uuid",
                "media"."uuid",
                "submission"."created_at",
                "submission"."submitted_at",
                "submission"."grade"
            ) "query"
        `);

        sqlChunks.push(sql`WHERE "rowNumber" = 1 AND "query"."course_id" = ${params.courseId}`)
        if (search) {
            sqlChunks.push(sql`AND "name" ilike LOWER(${search})`)
        }
        if (category) {
            let catArr = category.split(',')
            
            for (let i=0; i<catArr.length; i++) {
                if (i === 0) {
                    sqlChunks.push(sql`AND "query"."category_uuid" = ${catArr[i]}`)
                    continue
                } else {
                    sqlChunks.push(sql`OR "query"."category_uuid" = ${catArr[i]}`)
                } 
            }
        }


        sqlChunks.push(sql`ORDER BY
            ${sql.raw(sortColumn)} ${sql.raw(order || 'asc')} NULLS LAST
        `)

        sqlChunks.push(sql`
            OFFSET ${params.offset || DEFAULT_OFFSET}
            LIMIT ${params?.limit || DEFAULT_LIMIT}
        `)

        const query: SQL = sql.join(sqlChunks, sql.raw(' '));

        // const pgDialect = new PgDialect()
        // const string = pgDialect.sqlToQuery(query)
        // console.log(string)

        const result = await db.execute(query)

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
        return mapResult<ModelEntity, any>(result.rows, this.mapToEntity)
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
        var filters = [eq(this.table.slug, identifier)]
        if (identifier.match(uuidRegex)) {
            filters = [eq(this.table.uuid, identifier)]
        }

        if ('course' in params) {
            filters.push(eq(this.table.courseId, params.course))
        }

        const query = db.query['problem'].findFirst({
            where: and(...filters),
        })

        // console.log(query.toSQL())
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
    }


    // mapToEntity(item: TableType) {
        // console.log("logging it", this.EntityMapper)
        // return this.EntityMapper(item)
    //     const itemData = convertCase(item)
    //     if (itemData.createdAt) {
    //         itemData.createdAt = new Date(itemData.createdAt)
    //     }
    //     if (itemData.updatedAt) {
    //         itemData.updatedAt = new Date(itemData.updatedAt)
    //     }
    //     const Entity = ModelEntity.fromValues(itemData, item.uuid)
    //     if (isError(Entity)) {
    //         return Entity
    //     }
    //     if ('category' in itemData && itemData.category) {
    //         const categoryRepository = new CategoryRepository()
    //         const category = categoryRepository.mapToEntity(
    //             itemData.category as CategoryTable
    //         )
    //         if (!isError(category)) {
    //             Entity.category = category
    //         }
    //     }

    //     // if ('media' in item) {
    //     //     const assetRepository = new AssetRepository()
    //     //     const galleryItem = assetRepository.mapToEntity(
    //     //         item.media as AssetTable
    //     //     )
    //     //     if (!isError(galleryItem)) {
    //     //         Entity.image = galleryItem
    //     //     }
    //     // }
    //     if ('submissions' in item && typeof item.submissions !== 'undefined') {
    //         Entity.submissions = item.submissions
    //     }
    //     if ('submissionCount' in item && typeof item.submissionCount !== 'undefined') {
    //         Entity.submissionCount = item.submissionCount
    //     }
    //     if ('lastSubmitted' in item && typeof item.lastSubmitted !== 'undefined' && item.lastSubmitted) {
    //         Entity.lastSubmitted = item.lastSubmitted.toString()
    //     }
    //     if ('category' in item && typeof item.category !== 'undefined' && item.category) {
    //         Entity.categoryName = item.category.toString()
    //     }

    //     return Entity
    // }



}


// function convertCase(obj: any) {
//     const result: Record<string, string> = {}
//     const camelCaseColumns: Record<string, string> = {
//         category_uuid :'categoryUuid',
//         topic_id :'topicId',
//         course_id : 'courseId',
//         starter_code:'starterCode',
//         answer_code:'answerCode', 
//         is_deleted: 'isDeleted',
//         image_uuid: 'imageUuid', 
//         is_seeded: 'isSeeded', 
//         created_at: 'createdAt',
//         updated_at: 'updatedAt',
//         // submission_count: 'submissionCount',
//         last_submission: 'lastSubmission'
//     }

//     for (let [key, value] of Object.entries(camelCaseColumns)) {
//         if (typeof obj[key] !== 'undefined') {
//             result[value] = obj[key]
//             delete obj[key]
//         }
//     }
//     return { ...obj, ...result }
// }


export default Repository
