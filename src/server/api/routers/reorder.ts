import {
  type AnyPgTable,
  type InferInsertModel,
  type InferSelectModel,
  type PgColumn,
} from "drizzle-orm/pg-core";
import { and, eq, sql, gt, gte, lt, lte, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { type DB } from "~/server/db";

// A type constraint for a Drizzle table that has 'id' and 'position' columns.
type TableWithPosition = AnyPgTable & {
  id: PgColumn;
  position: PgColumn;
};

/**
 * Inserts a new record at a specified position, shifts subsequent siblings,
 * and returns the full re-ordered list of siblings.
 */
export async function insertAndReorder<T extends TableWithPosition>(
  db: DB,
  table: T,
  parentIdColumn: PgColumn,
  parentId: string,
  newPosition: number,
  newItemData: Omit<InferInsertModel<T>, "position">
): Promise<InferSelectModel<T>[]> {
  const updatedSiblings = await db.transaction(async (tx) => {
    // 1. Get current max position
    const siblings = await tx
      .select({ position: table.position })
      .from(table)
      .where(eq(parentIdColumn, parentId))
      .orderBy(desc(table.position));

    const maxPosition = siblings[0]?.position as number ?? 0;

    if (newPosition < 1 || newPosition > maxPosition + 1) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Position ${newPosition} is out of bounds. The highest possible position is ${maxPosition + 1}.`,
      });
    }

    // 2. Shift items down
    await tx
      .update(table)
      .set({ position: sql`${table.position} + 1` })
      .where(and(eq(parentIdColumn, parentId), gte(table.position, newPosition)));

    // 3. Insert new item
    await tx.insert(table).values({
      ...newItemData,
      position: newPosition,
    } as InferInsertModel<T>);

    // 4. Return the full, updated list of siblings
    return tx
      .select()
      .from(table)
      .where(eq(parentIdColumn, parentId))
      .orderBy(table.position);
  });

  return updatedSiblings;
}

/**
 * Updates the position of an existing record, re-orders its siblings,
 * and returns the full re-ordered list of siblings.
 */
export async function updateAndReorder<T extends TableWithPosition>(
  db: DB,
  table: T,
  parentIdColumn: PgColumn,
  id: string,
  data: Omit<Partial<InferInsertModel<T>>, "id">
): Promise<InferSelectModel<T>[]> {
  const { position: newPosition, ...otherData } = data;
  const hasOtherUpdates = Object.keys(otherData).length > 0;

  const updatedSiblings = await db.transaction(async (tx) => {
    // 1. First, apply any updates to non-position fields.
    // This happens inside the transaction, so it will be rolled back on failure.
    if (hasOtherUpdates) {
      await tx.update(table).set(otherData).where(eq(table.id, id));
    }

    //TODO: canwe just grab this from above?
    const [item] = await tx
      .select({
        currentPosition: table.position,
        parentId: parentIdColumn,
      })
      .from(table)
      .where(eq(table.id, id));

    if (!item) {
      // If the item wasn't found, the transaction will be rolled back.
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    
    // 2. If a new position is provided, perform the reordering logic.
    if (typeof newPosition === "number") {
      const currentPosition = item.currentPosition as number
      const parentId = item.parentId
      
      if (newPosition !== currentPosition) {
        // ... (The same robust reordering logic as before)
        if (newPosition < currentPosition) {
          await tx.update(table).set({ position: sql`${table.position} + 1` })
            .where(and(eq(parentIdColumn, parentId), gte(table.position, newPosition), lt(table.position, currentPosition)));
        } else {
          await tx.update(table).set({ position: sql`${table.position} - 1` })
            .where(and(eq(parentIdColumn, parentId), gt(table.position, currentPosition), lte(table.position, newPosition)));
        }
        await tx.update(table).set({ position: newPosition }).where(eq(table.id, id));
      }
    }

    // 3. Return the full, updated list of siblings in their final order.
    return tx.select().from(table).where(eq(parentIdColumn, item.parentId)).orderBy(table.position);
  });

  return updatedSiblings as InferSelectModel<T>[];
}

/**
 * Removes a record, re-orders the remaining siblings,
 * and returns the full re-ordered list of remaining siblings.
 */
export async function removeAndReorder<T extends TableWithPosition>(
  db: DB,
  table: T,
  parentIdColumn: PgColumn,
  id: string
): Promise<InferSelectModel<T>[]> {
  const updatedSiblings = await db.transaction(async (tx) => {
    // 1. Get item to remove
    const [itemToRemove] = await tx
      .select({ position: table.position, parentId: parentIdColumn })
      .from(table)
      .where(eq(table.id, id));

    if (!itemToRemove) throw new TRPCError({ code: "NOT_FOUND" });
    const { position: removedPosition, parentId } = itemToRemove;

    // 2. Delete the item
    await tx.delete(table).where(eq(table.id, id));

    // 3. Shift subsequent siblings up
    await tx
      .update(table)
      .set({ position: sql`${table.position} - 1` })
      .where(and(eq(parentIdColumn, parentId), gt(table.position, removedPosition)));

    // 4. Return the full, updated list of remaining siblings
    return tx
      .select()
      .from(table)
      .where(eq(parentIdColumn, parentId))
      .orderBy(table.position);
  });

  return updatedSiblings as InferSelectModel<T>[];
}
