import MapperCliente from '../mapper/mapperCliente';
import ClienteRepository from '../repository/clienteRepository';
import {ClienteDto} from '../type';

export default class ClienteService {
  private repository: ClienteRepository;
  constructor() {
    this.repository = new ClienteRepository();
  }

  async save(clientes: ClienteDto[]) {
    await Promise.all(
      clientes.map(async cliente => {
        await this.saveOn(cliente);
      }),
    );
  }

  private async saveOn(cliente: ClienteDto) {
    const hasCliente = await this.repository.getByCode(cliente.Codigo);

    if (hasCliente) {
      throw new Error('Cliente com mesmo codigo já cadastrado!');
    }

    const hasCPFCNPJ = await this.repository.getByCNPJCPF(cliente.CNPJCPF);

    if (hasCPFCNPJ) {
      throw new Error('Cliente com o mesmo CPF/CNPJ já cadastrado!');
    }

    await this.repository.save(cliente);
  }
}
