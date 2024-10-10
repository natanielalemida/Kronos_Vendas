// @ts-nocheck
import {
  ClienteToSave,
  SaveOrEditClienteteToSaveType,
  SaveOrEditClienteType,
} from '../type';

export default class MapperSaveOrUpdateCliente {
  mapToSave(cliente: SaveOrEditClienteType): ClienteToSave {
    // Aqui, você deve garantir que 'pessoa' esteja acessível ou definir 'pessoa' corretamente
    const contatos = [
      ...cliente.Email.map(email => ({
        Codigo: 0,
        Tipo: 2,
        Contato: email.Contato,
      })),
      ...cliente.Celular.map(celular => ({
        Codigo: 0,
        Tipo: 1,
        Contato: celular.Contato,
      })),
    ];

    return {
      Cliente: {
        id: cliente.id,
        CNPJCPF: cliente.CNPJCPF,
        IE: cliente.IE,
        NomeFantasia: cliente.NomeFantasia?.toUpperCase(),
        RazaoSocial:
          cliente.CNPJCPF?.length <= 11
            ? cliente.NomeFantasia?.toUpperCase()
            : cliente.RazaoSocial?.toUpperCase(),
        isSincronizado: 0,
      },
      Endereco: {
        id: cliente.EnderecoId,
        Logradouro: cliente.Logradouro,
        Numero: cliente.NumeroEndereco,
        Bairro: cliente.Bairro,
        CEP: cliente.CEP,
        Complemento: cliente.Complemento,
        CodigoMunicipio:
          cliente.Municipio?.MunicipioCodigo ||
          cliente.CodigoMunicipioRepository,
      },
      Contatos: contatos,
    };
  }
}
