import {useState} from 'react';
import PagamentoRepository from '../../../../../../../sync/pagamentos/repository/pagamentoRepository';
import {FormaPagamentoFromQueryDto} from '../../../../../../../sync/pagamentos/type';

export default function UseRepository() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [formaPagamento, setFormaPagamento] = useState<
    FormaPagamentoFromQueryDto[]
  >([]);
  const repository = new PagamentoRepository();

  const handleFetchData = async () => {
    setLoading(true);
    const query = await repository.getFormaPagamento();
    setFormaPagamento(query);
    setLoading(false);
  };
  return {
    handleFetchData,
    formaPagamento,
    isLoading,
    setLoading,
  };
}
