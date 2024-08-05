
import { db } from "@repetition/core/lib/db";
import { isError, ModelError } from "@repetition/core/types";
import { PgTable, TableConfig } from "drizzle-orm/pg-core";
import { and, eq } from "drizzle-orm";

abstract class BaseRepository<
  TableType extends PgTable<TableConfig>,
  ModelEntity extends { toObject: () => any, isNew: () => boolean},
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
            saved = await db
                .update(this.table)
                .set(data)
                //@ts-ignore
                .where(eq(this.table.uuid, entity.uuid))
                .returning()
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
    var updated = await db
      .update(this.table)
      .set({ ...data, updatedAt: new Date() })
      //@ts-ignore
      .where(eq(this.table.uuid, id));

    if (updated.rowCount === 0) {
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

    try {
      let delQuery = db
        .delete(this.table)
        //@ts-ignore
        .where(and(eq(this.table.uuid, id)));

      let del = await delQuery
      if (del.rowCount === 0) {
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
