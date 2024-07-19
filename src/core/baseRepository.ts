//@ts-nocheck
import { db } from "@/lib/db";
import { ModelError } from "@/core/types";
import { PgTable, TableConfig } from "drizzle-orm/pg-core";
import { and, eq } from "drizzle-orm";

abstract class BaseRepository<
  TableType extends PgTable<TableConfig>,
  ModelEntity extends { toObject: () => any },
  SelectTableType,
> {
  protected table: TableType;
  protected tableName: string;

  constructor(table: TableType, tableName: string) {
    this.table = table;
    this.tableName = tableName;
  }

  async create<T>(values: T): Promise<ModelEntity | ModelError> {
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

  async save(entity: ModelEntity): Promise<ModelEntity | ModelError> {
    var saved
    const data = entity.toObject()

    if (entity.isNew()) {
        try {
            ;[saved] = await db.insert(this.table).values(data).returning()
        } catch (e: any) {
            return {
                error: e.message,
            }
        }
    } else {
        try {
            saved = await db
                .update(this.table)
                .set(data)
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


  // async save(entity: ModelEntity): Promise<ModelEntity | ModelError> {
  //   var created;
  //   try {
  //     const values = entity.toObject();
  //     console.log(values)
  //     [created] = await db.insert(this.table).values(values).returning();
  //   } catch (e: any) {
  //     console.log("ERRRRORROR")
  //     console.log(e)

  //     return this.handleConstraints(e, entity);
  //   }

  //   if (!created) {
  //     console.log("NOT CREATED")
  //     return {
  //       error: `${this.tableName} not created`,
  //     };
  //   }
  //   return this.mapToEntity(created as SelectTableType);
  // }

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
      .where(eq(this.table.uuid, id));

    if (updated.rowCount === 0) {
      return {
        error: `${this.tableName} not updated`,
      };
    }

    return `${this.tableName} updated`;
  }

  async delete(storeId: string, id: string): Promise<string | ModelError> {
    if (!("uuid" in this.table)) {
      return {
        error: `Table does not have an Id column`,
      };
    }

    try {
      let del = await db
        .delete(this.table)
        .where(and(eq(this.table.uuid, id), eq(this.table.storeUuid, storeId)));

      if (del.rowCount === 0) {
        return {
          error: `${this.tableName} not deleted`,
        };
      }
    } catch (e: any) {
      return this.handleConstraints(e);

      return {
        error: `${this.tableName} not deleted`,
      };
    }

    return "Deleted";
  }

  // abstract mapToEntity(data: SelectTableType): ModelEntity | ModelError;
  abstract handleConstraints(e: any, entity?: ModelEntity): unknown;
}

export default BaseRepository;
