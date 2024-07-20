import { db } from '@repetition/core/lib/db'
import { category } from '@repetition/core/lib/db/schema/schema'
import { eq, desc, asc, ne, or, and, like, ilike } from 'drizzle-orm'
import { FetchParams } from '@repetition/core/category/Validators'
import { ModelError, isError } from '@repetition/core/types'
import { CategoryEntity as ModelEntity } from '@repetition/core/category/Entity'
import { PgColumn, PgSelect } from 'drizzle-orm/pg-core'
import { mapResult, uuidRegex } from '@repetition/core/lib'
import BaseRepository from '@repetition/core/baseRepository'

export type SelectTableType = typeof category.$inferSelect

const DEFAULT_LIMIT = 50
const DEFAULT_OFFSET = 0

class CategoryRepository extends BaseRepository<
    typeof category,
    ModelEntity,
    SelectTableType
> {
    constructor() {
        super(category, 'Category')
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
         if (params?.name) {
            filters.push(ilike(this.table.name, `%${params.name}%`))
        }
        if (params?.courseId) {
            filters.push( [eq(this.table.courseId, params.courseId)])
        }

        const query = db
            .select({
                id: self.table.id,
                uuid: self.table.uuid,
                name: self.table.name,
                courseId: self.table.courseId,
                slug: self.table.slug,
                description: self.table.description,
                isSeeded: self.table.isSeeded,
                createdAt: self.table.createdAt,
                updatedAt: self.table.updatedAt,
            })
            .from(this.table)
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

    async fetchByUuid(
        uuid: string,
        params: FetchParams = {}
    ): Promise<ModelEntity | ModelError> {

        var filters = [eq(this.table.slug, uuid)]
        if (uuid.match(uuidRegex)) {
            filters = [eq(this.table.uuid, uuid)]
        }
        const data = await db.query['category'].findFirst({
            where: and(...filters),
        })

        if (!data) {
            return {
                error: `${this.tableName} not found`,
            }
        }
        return this.mapToEntity(data)
    }




    handleConstraints(e: any, entity?: ModelEntity) {
        // if (e.constraint === 'product_category_uuid_category_uuid_fk') {
        //     return {
        //         error: 'Cannot delete category as it has associated products',
        //     }
        // }
        // if (e.constraint === 'category_slug_idx' && entity) {
        //     entity.uniqueSlug()
        //     return this.save(entity)
        // }

        // if (e.constraint === "order_item_product_uuid_product_uuid_fk") {
        //   return {
        //     error: "Cannon delete product as it has associated orders",
        //   };
        // }
    }

    mapToEntity(item: SelectTableType): ModelEntity | ModelError {
        if (!item) return {error: "Category is empty when mapping"}
        const Entity = ModelEntity.fromValues(item, item.uuid)
        if (isError(Entity)) {
            return Entity
        }

        return Entity
    }
}

export default CategoryRepository
