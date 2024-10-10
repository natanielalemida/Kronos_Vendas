import ClienteRepository from '../../../../../../../sync/clientes/repository/clienteRepository';
import MapperSaveOrUpdateCliente from '../mapper/saveOrUpdateMapper';
import SaveOrEditClienteRepository from '../repository/saveOrEditClienteRepository';
import {SaveOrEditClienteType} from '../type';

export default class SaveOrUpdateClienteService {
  private mapper: MapperSaveOrUpdateCliente;
  private repository: SaveOrEditClienteRepository;
  private clienteRepository: ClienteRepository;

  constructor() {
    this.mapper = new MapperSaveOrUpdateCliente();
    this.repository = new SaveOrEditClienteRepository();
    this.clienteRepository = new ClienteRepository();
  }

  validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove qualquer caractere que não seja dígito

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      return false;
    }

    let soma: number;
    let resto: number;

    soma = 0;
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.charAt(i - 1)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.charAt(i - 1)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
  }

  validarCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]+/g, ''); // Remove qualquer caractere que não seja dígito

    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
      return false;
    }

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let resto = soma % 11;
    if (resto < 2) resto = 0;
    else resto = 11 - resto;

    if (resto !== parseInt(digitos.charAt(0))) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    resto = soma % 11;
    if (resto < 2) resto = 0;
    else resto = 11 - resto;

    if (resto !== parseInt(digitos.charAt(1))) return false;

    return true;
  }

  validarCPFouCNPJ(valor: string): boolean {
    valor = valor.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos

    if (valor.length === 11) {
      return this.validarCPF(valor);
    } else if (valor.length === 14) {
      return this.validarCNPJ(valor);
    }

    return false;
  }

  async saveOrUpdate(cliente: SaveOrEditClienteType) {
    const formated = this.mapper.mapToSave(cliente);

    const existCliente = await this.clienteRepository.getByCNPJCPF(
      formated.Cliente.CNPJCPF,
    );

    const isCpfCnpjValido = this.validarCPFouCNPJ(formated.Cliente.CNPJCPF);

    if (!isCpfCnpjValido) {
      throw new Error('CNPJ/CPF inválido');
    }

    if (existCliente) {
      throw new Error('Cliente com o mesmo CNPJ/CPF já cadastrado');
    }

    if (formated.Cliente.id) {
      const result = await this.repository.pessoaComEndereco(
        formated.Cliente.id,
      );

      if (!result) {
        return await this.repository.save(formated);
      }

      return await this.repository.update({
        Cliente: {...formated.Cliente},
        Endereco: {...formated.Endereco, id: result.EnderecoId},
      });
    }
    return await this.repository.save(formated);
  }
}
