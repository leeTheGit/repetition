import { db } from '@repetition/core/lib/db'
import { organisation } from '@repetition/core/lib/db/schema/schema'
import { eq, desc, asc, ne, or, and, like, sql } from 'drizzle-orm'
import { FetchParams } from '@repetition/core/organisation/Validators'
import { ModelError } from '@repetition/core/types'
import { OrganisationEntity as ModelEntity } from '@repetition/core/organisation/Entity'
import { PgSelect } from 'drizzle-orm/pg-core'
import { mapResult } from '@repetition/core/lib'

export type TableType = typeof organisation.$inferSelect
export type CreateTableType = Omit<
    typeof organisation.$inferInsert,
    'id' | 'uuid' | 'createdAt' | 'updatedAt'
>

const DEFAULT_LIMIT = 50
const DEFAULT_OFFSET = 0

class Repository {
    private table = organisation
    private tableName = 'Organisation'

    async fetchAll(params: FetchParams = {}): Promise<ModelEntity[]> {
        var self = this
        const filters: any = []

        function withOrder<T extends PgSelect>(qb: T, order: string) {
            if (order === 'asc') {
                return qb.orderBy(asc(self.table.id))
            } else {
                return qb.orderBy(desc(self.table.id))
            }
        }

        let select = {
            id: this.table.id,
            uuid: this.table.uuid,
            name: this.table.name,
            timezone: this.table.timezone,
            logo: this.table.logo,
            logoReverse: this.table.logoReverse,
            domain: this.table.domain,
            email: this.table.email,
            replyEmail: this.table.replyEmail,
            createdAt: this.table.createdAt,
            updatedAt: this.table.updatedAt,
        }

        const query = db
            .select(select)
            .from(this.table)
            .where(and(...filters))
            .limit(params?.limit || DEFAULT_LIMIT)
            .offset(params?.offset || DEFAULT_OFFSET)
            .orderBy(desc(this.table.createdAt))
            .$dynamic()

        const result = await query

        return mapResult<ModelEntity, any>(result, this.mapToEntity)
    }

    async fetchBySubdomain(domain: string): Promise<ModelEntity | ModelError> {
        const query = db.query['organisation'].findFirst({
            where: eq(this.table.domain, domain),
        })
        // console.log(query.toSQL());
        const data = await query
        if (!data) {
            return {
                error: `${this.tableName} not found`,
            }
        }

        return this.mapToEntity(data)
    }

    async fetchByUuid(uuid: string): Promise<ModelEntity | ModelError> {
        const data = await db.query['organisation'].findFirst({
            where: eq(this.table.uuid, uuid),
        })

        if (!data) {
            return {
                error: `${this.tableName} not found`,
            }
        }

        return this.mapToEntity(data)
    }

    // async fetchByUserUuid(userUuid: string): Promise<ModelEntity[] | ModelError>  {
    //     const data = await db.query.category.findMany({
    //         where: eq(this.table.storeUuid, userUuid)
    //     })

    //     if (!data) {
    //         return {
    //             error: `${this.tableName} not found`
    //         };
    //     }

    //     return mapResult(data, mapToEntity);
    // }

    async create(values: CreateTableType): Promise<ModelEntity | ModelError> {
        try {
            const [created] = await db
                .insert(this.table)
                .values(values)
                .returning()
            if (!created) {
                return {
                    error: `${this.tableName} not created`,
                }
            }

            return this.mapToEntity(created)
        } catch (e: any) {
            return {
                error: `Error creating ${this.tableName}`,
            }
        }
    }
    async save(entity: ModelEntity): Promise<ModelEntity | ModelError> {
        var created
        try {
            ;[created] = await db
                .insert(this.table)
                .values(entity.toObject())
                .returning()
        } catch (e: any) {
            if (e.constraint === 'organisation_domain_unique') {
                entity.uniqueSubDomain()
                return this.save(entity)
            }
        }

        if (!created) {
            return {
                error: `${this.tableName} not created`,
            }
        }
        return this.mapToEntity(created)
    }

    async update(
        id: string,
        data: Partial<TableType>
    ): Promise<string | ModelError> {
        if (Object.keys(data).length === 0) {
            return {
                error: `Nothing to update`,
            }
        }

        try {
            var updated = await db
                .update(this.table)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(this.table.uuid, id))

            if (updated.rowCount === 0) {
                return {
                    error: `${this.tableName} not updated`,
                }
            }
        } catch (e: any) {
            console.log(e)
            return {
                error: `${this.tableName} not updated`,
            }
        }

        return `${this.tableName} updated`
    }

    async delete(id: string): Promise<string | ModelError> {
        try {
            let del = await db.delete(this.table).where(eq(this.table.uuid, id))

            if (del.rowCount === 0) {
                return {
                    error: `${this.tableName} not deleted`,
                }
            }
        } catch (e: any) {
            // if (e.constraint === "order_item_product_uuid_product_uuid_fk") {
            //   return {
            //     error: "Cannon delete product as it has associated orders",
            //   };
            // }
            return {
                error: `${this.tableName} not deleted`,
            }
        }

        return 'Deleted'
    }

    mapToEntity(item: TableType): ModelEntity | ModelError {
        return ModelEntity.fromValues(item, item.uuid)
    }
}

export default Repository
