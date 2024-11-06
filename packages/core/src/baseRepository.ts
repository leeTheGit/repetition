
import { db, DBType } from "@repetition/core/lib/db";
import { isError, ModelError } from "@repetition/core/types";
import { PgTable } from "drizzle-orm/pg-core";
import { and, eq } from "drizzle-orm";
import { PgColumn } from 'drizzle-orm/pg-core'

abstract class BaseRepository<
  TableType extends PgTable & {uuid?: PgColumn},
  ModelEntity extends { toObject: () => any, uuid?: string, isNew: () => boolean},
  SelectTableType,
> {
  protected table: TableType;
  protected tableName: string;
  protected db:DBType 

  constructor(table: TableType, tableName: string, injectDb?:DBType) {
    this.table = table;
    this.tableName = tableName;
    this.db = injectDb || db
  }

  async create<T extends typeof this.table["$inferInsert"]>(values:T): Promise<ModelEntity | ModelError> {
    try {
      const [created] = await db.insert(this.table).values(values).returning();
      if (!created) {
        return {
          error: `${this.tableName} not created`,
        };
      }

      return this.mapToEntity(created as SelectTableType);
    } catch (e: any) {
      console.log("catch", e)
      return await this.handleConstraints(e); 
    }
  }

  async save<T extends ModelEntity>(entity: T): Promise<ModelEntity | ModelError> {
    var saved
    const data = entity.toObject()

    if (entity.isNew()) {
        try {
            ;[saved] = await db.insert(this.table).values(data).returning()
        } catch (e: any) {
            return await this.handleConstraints(e, entity);
        }
    } else {
        try {
            const uuid: PgColumn | undefined = this.table.uuid 
            if (uuid) {
              saved = await db
                  .update(this.table)
                  .set(data)
                  .where(eq(uuid, entity.uuid))
                  .returning()
            }
        } catch (e: any) {
            console.log('error', e)
            return {
                error: e.message,
            }
        }
    }

    if (!saved) {
        return {
            error: `${this.tableName} not created`,
        }
    }
    return entity
  }



  async update(id: string, data: Partial<keyof typeof this.table>): Promise<string | ModelError> {
    var updated
    if (Object.keys(data).length === 0) {
      return {
        error: `Nothing to update`,
      };
    }

    if (!("uuid" in this.table)) {
      return {
        error: `Table does not have an Id column`,
      };
    }

    const uuid: PgColumn | undefined = this.table.uuid 
    if (uuid) {
      updated = await db
        .update(this.table)
        .set(data)
        .where(eq(uuid, id));
    }

    if (updated?.rowCount === 0) {
      return {
        error: `${this.tableName} not updated`,
      };
    }

    return `${this.tableName} updated`;
  }

  async delete(id: string): Promise<string | ModelError> {
    if (!("uuid" in this.table)) {
      return {
        error: `Table does not have an Id column`,
      };
    }

    let delQuery
    try {

      const uuid: PgColumn | undefined = this.table.uuid 
      if (uuid) {
        delQuery = db
          .delete(this.table)
          .where(and(eq(uuid, id)));
      }

      let del = await delQuery
      
      if (del?.rowCount === 0) {
        return {
          error: `${this.tableName} not deleted`,
        };
      }
    } catch (e: any) {
      console.log(e)
      let fix = await this.handleConstraints(e);
      
      if (isError(fix)) {
        return fix
      }

      return {
        error: `${this.tableName} not deleted`,
      };
    }

    return "Deleted";
  }

  abstract handleConstraints(e: any, entity?: ModelEntity): Promise<ModelEntity | ModelError>;
  abstract mapToEntity(item: SelectTableType): ModelEntity | ModelError
}

export default BaseRepository;
