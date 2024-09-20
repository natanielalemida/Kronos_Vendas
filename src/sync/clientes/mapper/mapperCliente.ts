import {ClienteDto, PessoaToSaveDto} from '../type';

export default class MapperCliente {
  mapCliente(cliente: ClienteDto): PessoaToSaveDto {
    return {
      Clientes: {
        Codigo: cliente.Codigo,
        CategoriaCodigo: cliente.Categoria?.Codigo
          ? cliente.Categoria.Codigo
          : null,
        RegiaoCodigo: cliente.Regiao?.Codigo ? cliente.Regiao.Codigo : null,
        DiaPagamento: cliente.DiaPagamento,
        LimiteCompra: cliente.LimiteCompra,
        DescontoMaximo: cliente.DescontoMaximo,
        TipoPreco: cliente.TipoPreco ? cliente.TipoPreco : null,
        AcrescimoPercentual: cliente.AcrescimoPercentual,
        PermiteComprarPazo: cliente.PermiteComprarPazo,
        CodigoPessoa: cliente.CodigoPessoa,
        isSincronizado:
          cliente.isSincronizado === 0 ? cliente.isSincronizado : 1,
        PessoaFJ: cliente.PessoaFJ,
        RazaoSocial: cliente.RazaoSocial,
        NomeFantasia: cliente.NomeFantasia,
        CNPJCPF: cliente.CNPJCPF ? cliente.CNPJCPF : null,
        IERG: cliente.IERG ? cliente.IERG : null,
        TipoContribuinte: cliente.TipoContribuinte,
        Observacao: cliente.Observacao,
        Ativo: cliente.Ativo,
        DataCadastro: new Date(cliente.DataCadastro),
      },
      Enderecos: cliente.Enderecos,
      Contatos: cliente.Contatos,
    };
  }
}
