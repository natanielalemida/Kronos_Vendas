import {useNavigation} from '@react-navigation/native';
import {useCliente} from '../../../../Clientes/context/clientContext';
import SavePedidoRepository from '../repository/savePedidoRepository';

export default function SavePedido() {
  const navigation = useNavigation();
  const {
    clienteOnContext,
    formaPagamento,
    ProdutosSelecionados,
    finalizarVenda,
    cleanPedido,
  } = useCliente();
  const repository = new SavePedidoRepository();
  const handleSave = async idUpdate => {
    const objeSave = {
      DataEmissao: new Date(),
      ModuloDeVenda: 2,
      OperacaoTipo: 2,
      Situacao: 0,
      CodigoClienteEndereco: null,
      TipoMovimentacaoCodigo: 1,
      TipoMovimentacaoDescricao: 'Venda',
      OperacaoSituacao: 1,
      DataOperacao: new Date(),
      Observacao: finalizarVenda?.Observacao,
      CodigoOperacaoVinculada: 0,
      IsOperacaoProcessada: 0,
      CodigoPessoa: clienteOnContext?.Codigo,
    };

    if (idUpdate) {
      await repository.UpdateOne(objeSave, idUpdate);
      await handleUpdateFormaPagamento(idUpdate);
      await handleUpdateProdutos(idUpdate);
      cleanPedido();
      navigation.navigate('resumoPedidoNavigation', {
        id: idUpdate,
        goBack: true,
      });
      return;
    }

    const id = await repository.saveOne(objeSave);
    await handleSaveFormaPagamento(id);
    await handleSaveProdutos(id);
    cleanPedido();
    navigation.navigate('resumoPedidoNavigation', {id, goBack: true});
  };

  const handleSaveFormaPagamento = async (id: number) => {
    const formasPagamento = formaPagamento?.flatMap(currentFormaPagamento => {
      return currentFormaPagamento.CondicaoPagamento.map(
        currentCondicaoPagamento => {
          return {
            CodigoPedido: id,
            CodigoFormaPagamento: currentCondicaoPagamento.CodigoFormaPagamento,
            CodigoCondicao: currentCondicaoPagamento.Codigo,
            ValorRecebido: currentCondicaoPagamento.ValorPago,
          };
        },
      );
    });

    await repository.saveFormaPagamento(formasPagamento);
  };

  const handleSaveProdutos = async (id: number) => {
    const Produtos = ProdutosSelecionados.map(currentProduto => {
      return {
        CodigoPedido: id,
        CodigoProduto: currentProduto.Codigo,
        Quantidade: currentProduto.Quantidade,
      };
    });

    await repository.saveProdutos(Produtos);
  };

  const handleUpdateFormaPagamento = async (id: number) => {
    const formasPagamento = formaPagamento?.flatMap(currentFormaPagamento => {
      return currentFormaPagamento.CondicaoPagamento.map(
        currentCondicaoPagamento => {
          return {
            CodigoPedido: id,
            CodigoFormaPagamento: currentCondicaoPagamento.CodigoFormaPagamento,
            CodigoCondicao: currentCondicaoPagamento.Codigo,
            ValorRecebido: currentCondicaoPagamento.ValorPago,
          };
        },
      );
    });

    await repository.UpdateFormaPagamento(formasPagamento, id);
  };

  const handleUpdateProdutos = async (id: number) => {
    const Produtos = ProdutosSelecionados.map(currentProduto => {
      return {
        CodigoPedido: id,
        CodigoProduto: currentProduto.Codigo,
        Quantidade: currentProduto.Quantidade,
      };
    });

    await repository.UpdateProdutos(Produtos, id);
  };

  return {
    handleSave,
  };
}
