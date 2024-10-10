import ClienteRepository from '../../../../Clientes/components/criarOuEditarUsuario/repository/saveOrEditClienteRepository';

export function getClienteToSave() {
  const repository = new ClienteRepository();
  const getByIdToSave = async (id: number) => {
    return await repository.pessoaComEnderecoById(id);
  };

  const getByCodeToSave = async (id: number) => {
    return await repository.pessoaComEndereco(id);
  };

  return {
    getByIdToSave,
    getByCodeToSave,
  };
}
