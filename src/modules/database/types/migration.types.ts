export type DatabaseMigrationDefinition = {
  id: string;
  description: string;
  run: () => Promise<void>;
};

export type AppliedMigrationRecord = {
  id: string;
};
