import {useCallback, useState} from 'react';

import {useAppStore} from '@/shared/store/useAppStore';
import {useSyncExecution} from '@/modules/sync/hooks/useSyncExecution';

export function useSetupMenuRouter() {
  const [isModalActive, setIsModalActive] = useState(false);
  const {isRunning: isSyncing} = useSyncExecution();
  const selectedCustomer = useAppStore(
    state => state.salesDraft.selectedCustomer,
  );
  const selectedProductsLength = useAppStore(
    state => state.salesDraft.selectedProducts.length,
  );

  const handleToggleFilterModal = useCallback(() => {
    setIsModalActive(currentValue => !currentValue);
  }, []);

  return {
    clienteOnContext: selectedCustomer,
    isModalActive,
    isSyncing,
    produtosSelecionadosLength: selectedProductsLength,
    setIsModalActive,
    handleToggleFilterModal,
  };
}
