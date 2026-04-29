export function getSyncStepStatusLabel(status: string): string {
  switch (status) {
    case 'completed':
      return 'Concluída';
    case 'running':
      return 'Em andamento';
    case 'failed':
      return 'Falhou';
    case 'skipped':
      return 'Ignorada';
    default:
      return 'Pendente';
  }
}
