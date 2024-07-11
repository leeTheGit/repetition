import { db } from '@/lib/db'
import { category } from '@/lib/db/schema/schema'
import { eq, desc, asc, ne, or, and, like, ilike } from 'drizzle-orm'
import { FetchParams } from '@/core/category/Validators'
import { ModelError, isError } from '@/core/types'
import { CategoryEntity as ModelEntity } from '@/core/category/Entity'
import { PgColumn, PgSelect } from 'drizzle-orm/pg-core'
import { mapResult } from '@/lib'
import BaseRepository from '@/core/baseRepository'

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

        const query = db
            .select({
                id: self.table.id,
                uuid: self.table.uuid,
                name: self.table.name,
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

    private fetchOne(
        id: string,
        col: keyof typeof category = 'uuid',
        params: FetchParams = {}
    ) {
        const filters: any = []

        const query = db.query['category'].findFirst({
            where: and(eq(this.table[col] as PgColumn, id), ...filters),
        })
        return query
    }

    async fetchByUuid(
        uuid: string,
        params: FetchParams = {}
    ): Promise<ModelEntity | ModelError> {
        const data = await this.fetchOne(uuid, 'uuid', params)
        if (!data) {
            return {
                error: `${this.tableName} not found`,
            }
        }
        return this.mapToEntity(data)
    }

    async fetchBySlug(
        slug: string,
        params: FetchParams = {}
    ): Promise<ModelEntity | ModelError> {
        const data = await this.fetchOne(slug, 'slug', params)
        if (!data) {
            return {
                error: `${this.tableName} not found`,
            }
        }
        return this.mapToEntity(data)
    }

    async fetchFirstByStoreUuid(
        storeUuid: string
    ): Promise<ModelEntity | ModelError> {
        const data = await db.query.category.findFirst()

        if (!data) {
            return {
                error: `${this.tableName} not found`,
            }
        }

        return this.mapToEntity(data)
    }

    async fetchByUserUuid(
        userUuid: string
    ): Promise<ModelEntity[] | ModelError> {
        const data = await db.query.category.findMany()

        if (!data) {
            return {
                error: `${this.tableName} not found`,
            }
        }

        return mapResult<ModelEntity, any>(data, this.mapToEntity)
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

    mapToEntity(item: SelectTableType): ModelEntity | ModelError {
        const Entity = ModelEntity.fromValues(item, item.uuid)
        if (isError(Entity)) {
            return Entity
        }

        return Entity
    }
}

export default CategoryRepository
