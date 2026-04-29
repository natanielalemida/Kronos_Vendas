export function chunkArray<T>(items: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];

  for (
    let currentIndex = 0;
    currentIndex < items.length;
    currentIndex += chunkSize
  ) {
    chunks.push(items.slice(currentIndex, currentIndex + chunkSize));
  }

  return chunks;
}
