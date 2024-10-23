
import { db } from "@/lib/db";
import { isError, ModelError } from "@repetition/core/types";
import { PgTable, TableConfig } from "drizzle-orm/pg-core";
import { and, eq } from "drizzle-orm";
import { PgColumn } from 'drizzle-orm/pg-core'

abstract class BaseRepository<
  TableType extends PgTable<TableConfig> & {uuid?: PgColumn},
  ModelEntity extends { toObject: () => any, uuid?: string, isNew: () => boolean},
  SelectTableType,
> {
  protected table: TableType;
  protected tableName: string;

  constructor(table: TableType, tableName: string) {
    this.table = table;
    this.tableName = tableName;
  }

  async create(values:any): Promise<ModelEntity | ModelError> {
    try {
      const [created] = await db.insert(this.table).values(values).returning();
      if (!created) {
        return {
          error: `${this.tableName} not created`,
        };
      }

      return this.mapToEntity(created as SelectTableType);
    } catch (e: any) {
      
      return {
        error: `Error creating ${this.tableName}`,
      };
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



  async update<T>(id: string, data: Partial<T>): Promise<string | ModelError> {
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
        .set({ ...data, updatedAt: new Date() })
        .where(eq(uuid, id));
    }

    if (updated?.rowCount === 0) {
      return {
        error: `${this.tableName} not updated`,
      };
    }

    return `${this.tableName} updated`;
  }

  async delete(courseId: string, id: string): Promise<string | ModelError> {
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
