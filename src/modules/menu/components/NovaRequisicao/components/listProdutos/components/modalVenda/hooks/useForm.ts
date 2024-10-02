import {useEffect, useState} from 'react';
import {UseFormPros} from '../type';

export default function UseForm({
  produto,
  isAtacadoActive,
  isAtacado,
  isEditing,
  isActive,
  setIsActive,
}: UseFormPros) {
  const [quantidade, setQuantidade] = useState<number>(1);
  const [observacao, setObservacao] = useState('');
  const [desconto, setDesconto] = useState('0.00');
  const [valorVenda, setValorVenda] = useState('0.00');

  useEffect(() => {
    const valorVendaEdit = isEditing
      ? produto?.ValorVendaDesconto
      : produto?.ValorVenda;
    const total = isAtacado ? produto?.ValorVendaAtacado : valorVendaEdit;

    setValorVenda(total?.toFixed(2));
  }, [produto, isActive]);

  useEffect(() => {
    const valorVendaEdit = isEditing
      ? produto?.ValorVendaDesconto
      : produto?.ValorVenda;
    const total = isAtacado ? produto?.ValorVendaAtacado : valorVendaEdit;

    setValorVenda(total?.toFixed(2));
  }, [isAtacado]);

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
