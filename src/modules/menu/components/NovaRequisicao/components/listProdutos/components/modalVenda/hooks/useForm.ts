import {useEffect, useState} from 'react';
import {UseFormPros} from '../type';

export default function UseForm({produto, setIsActive}: UseFormPros) {
  const [quantidade, setQuantidade] = useState<number>(1);
  const [observacao, setObservacao] = useState('');
  const [desconto, setDesconto] = useState('0.00');
  const [valorVenda, setValorVenda] = useState('0.00');

  useEffect(() => {
    if (produto?.ValorVenda) {
      setValorVenda(produto?.ValorVenda.toFixed(2));
    }
  }, [produto]);

  const handleTextChange = (value: string) => {
    let numericValue: string;

    if (produto?.PermiteFracionar) {
      numericValue = value
        .replace(/[^\d.,]/g, '')
        .replace(/,/g, '.')
        .replace(/([.])(?=.*[.])/g, '');
    } else {
      numericValue = value.replace(/[^0-9]/g, '');
    }

    setQuantidade(Number(numericValue));
  };

  const cleanForm = () => {
    setDesconto('0.00');
    setValorVenda('0.00');
    setObservacao('');
    setQuantidade(1);
    setIsActive(false);
  };

  return {
    quantidade,
    observacao,
    desconto,
    valorVenda,
    setValorVenda,
    setDesconto,
    setObservacao,
    setQuantidade,
    handleTextChange,
    cleanForm,
  };
}
