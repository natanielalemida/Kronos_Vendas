import {SyncExecutionStatus} from '../types/sync-run.types';
import {SyncActionCard} from '../types/sync-page.types';

export function getSyncStatusTitle(status: SyncExecutionStatus): string {
  switch (status) {
    case 'running':
      return 'Sincronização em andamento';
    case 'success':
      return 'Sincronização concluída';
    case 'error':
      return 'Erro na sincronização';
    default:
      return 'Pronto para sincronizar';
  }
}

export function getSyncStatusDescription(
  status: SyncExecutionStatus,
): string {
  switch (status) {
    case 'running':
      return 'Não feche o app até terminar.';
    case 'success':
      return 'Os dados foram atualizados com sucesso.';
    case 'error':
      return 'Algo deu errado. Tente novamente.';
    default:
      return 'Toque no botão abaixo para atualizar os dados do app.';
  }
}

export function splitSyncActionCards(actionCards: SyncActionCard[]) {
  return {
    primaryAction: actionCards.find(actionCard => actionCard.id === 'sync-all'),
    secondaryActions: actionCards.filter(
      actionCard => actionCard.id !== 'sync-all',
    ),
  };
}
