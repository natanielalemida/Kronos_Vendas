import {useCallback, useState} from 'react';

import {useAppSession} from '@/shared/hooks/useAppSession';

export function useSetupMenuRouter() {
  const [isModalActive, setIsModalActive] = useState(false);
  const {clienteOnContext, isSyncing, ProdutosSelecionados} = useAppSession();

  const handleToggleFilterModal = useCallback(() => {
    setIsModalActive(currentValue => !currentValue);
  }, []);

  return {
    clienteOnContext,
    isModalActive,
    isSyncing,
    produtosSelecionadosLength: ProdutosSelecionados.length,
    setIsModalActive,
    handleToggleFilterModal,
  };
}
