import {UsuarioDto} from '../../../login/hooks/type';

export default class NovoCliente {
  mappNovoCliente(data: any[], usuario: UsuarioDto) {
    return data.map(pessoa => {
      // Agrupar contatos por tipo
      const contatos = data
        .filter(item => item.CodigoPessoa === pessoa.Codigo) // Filtra contatos do mesmo CódigoPessoa
        .reduce(
          (acc, curr) => {
            if (curr.TipoContato === 2) {
              // Tipo 2 é Email
              acc.Email.push({
                Codigo: curr.CodigoContato,
                Tipo: curr.TipoContato,
                Contato: curr.Contato,
              });
            } else if (curr.TipoContato === 1) {
              // Tipo 1 é Celular
              acc.Celular.push({
                Codigo: curr.CodigoContato,
                Tipo: curr.TipoContato,
                Contato: curr.Contato,
              });
            }
            return acc;
          },
          {Email: [], Celular: []},
        );

      return {
        Codigo: pessoa.Codigo || 0,
        Categoria: pessoa.CategoriaCodigo || null,
        Regiao: pessoa.RegiaoCodigo || null,
        DiaPagamento: pessoa.DiaPagamento || 30,
        LimiteCompra: pessoa.LimiteCompra || 5000.0,
        BloquearCliente: pessoa.BloquearCliente || true, // Mapeamento manual necessário
        ForcarAtualizacaoCadastro: pessoa.ForcarAtualizacaoCadastro || false, // Mapeamento manual necessário
        CarenciaPagamento: pessoa.CarenciaPagamento || 3, // Mapeamento manual necessário
        DescontoMaximo: pessoa.DescontoMaximo || 0.0,
        DataNascimento: pessoa.DataNascimento || null, // Mapeamento manual necessário
        TipoPreco: pessoa.TipoPreco || null,
        PessoaReferencia: pessoa.PessoaReferencia || null, // Mapeamento manual necessário
        AcrescimoPercentual: pessoa.AcrescimoPercentual || 0.0,
        Veiculos: pessoa.Veiculos || null, // Mapeamento manual necessário
        PermiteComprarPazo: pessoa.PermiteComprarPazo || true,
        CodigoPessoa: pessoa.CodigoPessoa || 0,
        PessoaFJ: pessoa.PessoaFJ || 0,
        RazaoSocial: pessoa.RazaoSocial,
        NomeFantasia: pessoa.NomeFantasia,
        CNPJCPF: pessoa.CNPJCPF || '',
        IERG: pessoa.IERG || '',
        TipoContribuinte: pessoa.PessoaFJ === 'PJ' && pessoa.IERG ? 1 : 9, // Mapeamento manual necessário
        Observacao: pessoa.Observacao || '',
        Ativo: pessoa.Ativo || true,
        DataCadastro: pessoa.DataCadastro || new Date().toISOString(),
        ResponsavelCadastro: {
          CodigoUsuario: usuario.Codigo,
          Nome: usuario.Referencia,
        },
        Enderecos: [
          {
            Codigo: pessoa.CodigoEndereco || 0,
            CodigoPessoa: pessoa.Codigo || 0,
            Tipo: pessoa.Tipo || 0,
            TipoDescricao: pessoa.TipoDescricao || 'Principal',
            CEP: pessoa.CEP || '',
            Logradouro: pessoa.Logradouro || '',
            Numero: pessoa.Numero || '',
            Bairro: pessoa.Bairro || '',
            Complemento: pessoa.Complemento || '',
            Municipio: {
              Codigo: pessoa.CodigoMunicipio || 0,
              MunicipioCodigo: pessoa.MunicipioCodigo || 0,
              MunicipioNome: pessoa.MunicipioNome || '',
              UFCodigo: pessoa.UFCodigo || 0,
              UFNome: pessoa.UFNome || '',
              UFSigla: pessoa.UFSigla || '',
              PaisCodigo: pessoa.PaisCodigo || 0,
              PaisNome: pessoa.PaisNome || '',
            },
          },
        ],
        Contatos: contatos,
      };
    });
  }

  mappNovoClienteForm(pessoa: any, usuario: UsuarioDto) {
    const emails =
      pessoa?.Email && pessoa.Email.length
        ? pessoa.Email.map(email => ({
            Codigo: 0,
            CodigoPessoa: 0,
            Tipo: 2,
            Contato: email.Contato,
          }))
        : [];
    const celulars =
      pessoa?.Celular && pessoa.Celular.length
        ? pessoa.Celular.map(celular => ({
            Codigo: 0,
            CodigoPessoa: 0,
            Tipo: 1,
            Contato: celular.Contato,
          }))
        : [];

    const contatos =
      [...emails, ...celulars] && [...emails, ...celulars].length
        ? [...emails, ...celulars]
        : null;

    console.log({Teste: pessoa});
    console.log({teste02: pessoa.IERG});

    return {
      Codigo: pessoa.Codigo || 0,
      Categoria: pessoa.CategoriaCodigo || null,
      Regiao: pessoa.RegiaoCodigo || null,
      DiaPagamento: pessoa.DiaPagamento || 30,
      LimiteCompra: pessoa.LimiteCompra || 0,
      BloquearCliente: pessoa.BloquearCliente || true, // Mapeamento manual necessário
      ForcarAtualizacaoCadastro: pessoa.ForcarAtualizacaoCadastro || false, // Mapeamento manual necessário
      CarenciaPagamento: pessoa.CarenciaPagamento || 3, // Mapeamento manual necessário
      DescontoMaximo: pessoa.DescontoMaximo || 0.0,
      DataNascimento: pessoa.DataNascimento || null, // Mapeamento manual necessário
      TipoPreco: pessoa.TipoPreco || null,
      PessoaReferencia: pessoa.PessoaReferencia || null, // Mapeamento manual necessário
      AcrescimoPercentual: pessoa.AcrescimoPercentual || 0.0,
      Veiculos: pessoa.Veiculos || null, // Mapeamento manual necessário
      PermiteComprarPazo: pessoa.PermiteComprarPazo || true,
      CodigoPessoa: pessoa.CodigoPessoa || 0,
      PessoaFJ: pessoa.PessoaFJ || 0,
      NomeFantasia: pessoa.NomeFantasia,
      RazaoSocial: pessoa.RazaoSocial || pessoa.NomeFantasia,
      CNPJCPF: pessoa.CNPJCPF || '',
      IERG: pessoa.IERG || '',
      TipoContribuinte: pessoa.CNPJCPF.length > 11 && pessoa.IERG ? 1 : 9, // Mapeamento manual necessário
      Observacao: pessoa.Observacao || '',
      Ativo: pessoa.Ativo || true,
      DataCadastro: pessoa.DataCadastro || new Date().toISOString(),
      ResponsavelCadastro: {
        CodigoUsuario: usuario.Codigo,
        Nome: usuario.Referencia,
      },
      Enderecos: [
        {
          Codigo: pessoa.CodigoEndereco || 0,
          CodigoPessoa: pessoa.Codigo || 0,
          Tipo: pessoa.Tipo || 0,
          TipoDescricao: pessoa.TipoDescricao || 'Principal',
          CEP: pessoa.CEP || '',
          Logradouro: pessoa.Logradouro || '',
          Numero: pessoa.Numero || '',
          Bairro: pessoa.Bairro || '',
          Complemento: pessoa.Complemento || '',
          Municipio: {
            Codigo: pessoa.Municipio.Codigo || 0,
            MunicipioCodigo: pessoa.Municipio.MunicipioCodigo || 0,
          },
        },
      ],
      Contatos: contatos,
    };
  }
}
