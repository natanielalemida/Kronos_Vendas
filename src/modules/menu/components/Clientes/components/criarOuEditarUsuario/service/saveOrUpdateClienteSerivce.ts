import MapperSaveOrUpdateCliente from '../mapper/saveOrUpdateMapper';
import SaveOrEditClienteRepository from '../repository/saveOrEditClienteRepository';
import {SaveOrEditClienteType} from '../type';

export default class SaveOrUpdateClienteService {
  private mapper: MapperSaveOrUpdateCliente;
  private repository: SaveOrEditClienteRepository;

  constructor() {
    this.mapper = new MapperSaveOrUpdateCliente();
    this.repository = new SaveOrEditClienteRepository();
  }
  async saveOrUpdate(cliente: SaveOrEditClienteType) {
    const formated = this.mapper.mapToSave(cliente);
    if (formated.Cliente.id) {
      const result = await this.repository.pessoaComEndereco(
        formated.Cliente.id,
      );

      if (!result) {
        await this.repository.save(formated);
        return;
      }

      await this.repository.update({
        Cliente: {...formated.Cliente},
        Endereco: {...formated.Endereco, id: result.EnderecoId},
      });
      return;
    }
    await this.repository.save(formated);
  }
}
