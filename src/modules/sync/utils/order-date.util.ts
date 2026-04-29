export function formatOrderSyncDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}/${day}/${year} 00:00:00`;
}

export function createOrderSyncRange(daysBack: number): {
  startDate: string;
  endDate: string;
} {
  const today = new Date();
  const startDate = new Date(today);

  startDate.setDate(today.getDate() - daysBack);

  return {
    startDate: formatOrderSyncDate(startDate),
    endDate: formatOrderSyncDate(today),
  };
}
