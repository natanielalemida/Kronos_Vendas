import {knexConfig} from '@/database/connection';

export async function ensureColumn(
  tableName: string,
  columnName: string,
  addColumn: () => Promise<void>,
): Promise<void> {
  const hasColumn = await knexConfig.schema.hasColumn(tableName, columnName);

  if (hasColumn) {
    return;
  }

  await addColumn();
}
