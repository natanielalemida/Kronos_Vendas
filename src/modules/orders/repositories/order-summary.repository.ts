import {VendaDto} from '@/modules/sync/types/order-sync.types';

import {OrderRepository} from './order.repository';
import {OrderSummaryRecord} from '../types/order-summary.types';

export class OrderSummaryRepository {
  constructor(private readonly orderRepository = new OrderRepository()) {}

  private mapOrderSummaryPayload(
    payload: VendaDto,
    id: number,
  ): OrderSummaryRecord {
    return {
      Codigo: payload.Codigo || undefined,
      DataEmissao:
        typeof payload.DataEmissao === 'string'
          ? payload.DataEmissao
          : new Date(payload.DataEmissao).toISOString(),
      id,
      Itens: payload.Itens.map(item => ({
        Codigo: item.CodigoProduto,
        CodigoBarrasAtacado: '',
        CodigoDeBarras: '',
        CodigoGrupo: 0,
        CodigoMarca: null,
        CodigoProduto: item.CodigoProduto,
        CodigoSetor: 0,
        CodigoSubGrupo: null,
        Descricao: item.Descricao,
        Observacao: '',
        PermiteFracionar: false,
        Quantidade: item.Quantidade,
        Referencia: '',
        UnidadeMedida: item.UnidadeMedida,
        UnidadeMedidaAtacado: item.UnidadeMedida,
        ValorCusto: item.ValorCusto,
        ValorOriginalProduto: item.ValorOriginalProduto,
        ValorUnitario:
          (item as VendaDto['Itens'][number] & {ValorUnitario?: number})
            .ValorUnitario ?? item.ValorProduto,
        ValorVenda:
          (item as VendaDto['Itens'][number] & {ValorVenda?: number})
            .ValorVenda ?? item.ValorProduto,
        ValorVendaAtacado: 0,
        ValorVendaDesconto:
          (item as VendaDto['Itens'][number] & {ValorVendaDesconto?: number})
            .ValorVendaDesconto ?? item.ValorProduto,
        VendeProdutoNoAtacado: false,
      })),
      MeiosPagamentos: payload.MeiosPagamentos.map(paymentMethod => ({
        FormaPagamento: {
          Descricao: paymentMethod.FormaPagamento?.Descricao ?? '',
        },
        ValorRecebido: paymentMethod.ValorRecebido,
      })),
      Observacao: payload.Observacao,
      Pessoa: {
        CNPJCPF: payload.Pessoa.CNPJCPF,
        Codigo: payload.Pessoa.Codigo,
        NomeFantasia: payload.Pessoa.NomeFantasia,
        RazaoSocial: payload.Pessoa.RazaoSocial,
        TipoPreco: payload.Pessoa.TipoPreco,
        id: payload.Pessoa.id,
      },
    };
  }

  async findById(
    id: number,
    terminal: number,
  ): Promise<OrderSummaryRecord | undefined> {
    const result = await this.orderRepository.getOrderSyncPayloadById(
      id,
      terminal,
    );

    if (!result) {
      return undefined;
    }

    return this.mapOrderSummaryPayload(result, id);
  }

  async deleteById(id: number): Promise<void> {
    await this.orderRepository.deleteOrderById(id);
  }
}
