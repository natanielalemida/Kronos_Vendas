import {Dispatch, SetStateAction} from 'react';
import {ClienteDto} from '../../../../sync/clientes/type';
import {UsuarioDto} from '../../../login/hooks/type';
import {ParametrosLocaisDto} from '../../../menu/components/Configuracoes/type';
import NovoCliente from '../mapper/mapperCliente';
import ApiInstace from '../../../../api/ApiInstace';
import {EnviarPessoa} from '../type/enviarCliente';
import EnviarClienteRepository from '../repository/enviarClienteRepository';
import SaveOrUpdateClienteService from '../../../menu/components/Clientes/components/criarOuEditarUsuario/service/saveOrUpdateClienteSerivce';
import {Alert} from 'react-native';

export default class ServiceEnviarSingleCliente {
  private params: ParametrosLocaisDto[];
  private usuario: UsuarioDto;
  private cliente: ClienteDto;
  private repository: EnviarClienteRepository;
  private mapper: NovoCliente;
  private service: SaveOrUpdateClienteService;
  private setProgress: Dispatch<
    SetStateAction<{message: string; progress: number} | undefined>
  >;
  constructor(
    params: ParametrosLocaisDto[],
    usuario: UsuarioDto,
    cliente: ClienteDto,
    setProgress: Dispatch<
      SetStateAction<{message: string; progress: number} | undefined>
    >,
  ) {
    this.params = params;
    this.usuario = usuario;
    this.cliente = cliente;
    this.repository = new EnviarClienteRepository();
    this.mapper = new NovoCliente();
    this.service = new SaveOrUpdateClienteService();
    this.setProgress = setProgress;
  }

  private async enviar(pessoa: EnviarPessoa) {
    try {
      const data: ApiResponseDto = await ApiInstace.openUrl({
        method: 'post',
        data: pessoa,
        headers: {
          Empresa: 1,
          Auth: this.usuario.Hash,
        },
        endPoint: 'arc/cliente',
      });

      return data;
    } catch (err) {
      throw err;
    }
  }

  private async verify(data: ApiResponseDto) {
    const successfully = Array.isArray(data.Mensagens);
    if (!successfully) return false;
    return true;
  }

  async iniciarSincronizacaoSingle(initSync: boolean) {
    this.setProgress({message: 'Iniciando sincronização...', progress: 0});

    const syncAndSave = this.params.find(
      parametro => parametro.Descricao === 'UsarApenasOnline',
    );

    const clienteSend = this.mapper.mappNovoClienteForm(
      this.cliente,
      this.usuario,
    );

    if (syncAndSave) {
      this.setProgress({message: 'Enviando para o servidor', progress: 0.4});

      const result = await this.enviar(clienteSend);

      const sucess = await this.verify(result);

      if (!sucess) {
        this.setProgress(undefined);
        Alert.alert('Falha', `${result.mensagens[0].conteudo}`);
        return;
      }

      const exisitUser = await this.repository.getByCode(
        result.Resultado.Codigo,
      );

      if (exisitUser) {
        const salvou = await this.repository.saveOneSync(
          result.Resultado,
          this.cliente.id,
        );
        this.setProgress(undefined);
        return salvou;
      }

      this.setProgress({message: 'Salvando cliente', progress: 0.8});

      const salvou = await this.repository.saveSyncOne(result.Resultado);
      this.setProgress(undefined);
      return salvou;
    }

    this.setProgress({message: 'salvando', progress: 0.4});

    if (!initSync) {
      const salvou = await this.service.saveOrUpdate(this.cliente);
      this.setProgress(undefined);
      return salvou;
    }

    if (initSync) {
      const result = await this.enviar(clienteSend);

      const sucess = await this.verify(result);

      if (!sucess) {
        this.setProgress(undefined);
        Alert.alert('Falha', `${result.mensagens[0].conteudo}`);
        return;
      }

      if (this.cliente.id) {
        const salvou = await this.repository.saveOneSync(
          result.Resultado,
          this.cliente.id,
        );
        this.setProgress(undefined);
        return salvou;
      }

      const salvou = await this.repository.saveSyncOne(result.Resultado);
      this.setProgress(undefined);
      return salvou;
    }

    this.setProgress(undefined);
  }
}
