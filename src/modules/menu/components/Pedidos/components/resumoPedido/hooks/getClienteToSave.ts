import ClienteRepository from '../../../../Clientes/components/criarOuEditarUsuario/repository/saveOrEditClienteRepository';

export function getClienteToSave() {
  const repository = new ClienteRepository();
  const getByIdToSave = async (id: number) => {
    return await repository.pessoaComEnderecoById(id);
  };

  const getByIdToSaveByCpf = async (cpf: string) => {
    return await repository.pessoaComEnderecoByCpf(cpf);
  };

  const getByCodeToSave = async (id: number) => {
    return await repository.pessoaComEndereco(id);
  };

  return {
    getByIdToSave,
    getByCodeToSave,
    getByIdToSaveByCpf,
  };
}
