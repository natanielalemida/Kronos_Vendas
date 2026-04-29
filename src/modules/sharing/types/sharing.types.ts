export type ShareFileResult = {
  shared: boolean;
  fileUri?: string;
};

export type DatabaseSharePaths = {
  sourceUri: string;
  cacheUri: string;
};
