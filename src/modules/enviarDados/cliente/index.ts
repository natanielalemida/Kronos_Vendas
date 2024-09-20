import {Dispatch, SetStateAction} from 'react';
import {UsuarioDto} from '../../login/hooks/type';
import EnviarClienteRepository from './repository/enviarClienteRepository';
import {EnviarPessoa} from './type/enviarCliente';
import ApiInstace from '../../../api/ApiInstace';

export default class EnviarClientes {
  private usuario: UsuarioDto;
  private repository: EnviarClienteRepository;
  private setProgress: Dispatch<
    SetStateAction<{message: string; progress: number}>
  >;

  constructor(
    usuario: UsuarioDto,
    setProgress: Dispatch<SetStateAction<{message: string; progress: number}>>,
  ) {
    this.setProgress = setProgress;
    this.usuario = usuario;
    this.repository = new EnviarClienteRepository();
  }

  private updateProgress(currentStep: number, totalSteps: number): number {
    const progress = (currentStep / totalSteps) * 100;
    return progress;
  }

  private async enviarCliente(pessoa: EnviarPessoa): Promise<void> {
    try {
      // Simula uma espera de 5 segundos, para demonstrar o comportamento assíncrono
      //   await new Promise(resolve => setTimeout(resolve, 5000));

      await ApiInstace.openUrl({
        method: 'post',
        data: pessoa,
        headers: {
          Empresa: 1,
          Auth: this.usuario.Hash,
        },
        endPoint: 'arc/cliente',
      });
    } catch (err) {
      console.log(err);
    }
  }

  async runEnviarClientes() {
    this.setProgress({
      message: `Iniciando enviado de clientes`,
      progress: this.updateProgress(1, 100),
    });

    const clientes = await this.repository.getClientes(this.usuario);

    console.log({count: clientes.length});

    this.setProgress({
      message: `Enviando clientes`,
      progress: this.updateProgress(0.8, clientes.length),
    });

    const promises = clientes.map(async (cliente, index) => {
      const currentStep = index + 1;
      this.setProgress({
        message: `Enviando cliente ${currentStep}|${clientes.length}`,
        progress: this.updateProgress(currentStep / 2, clientes.length),
      });
      await this.enviarCliente(cliente);
    });

    // Aguarda até que todas as promessas sejam resolvidas
    await Promise.all(promises);

    // Agora, esta linha será executada somente depois que todas as promessas forem resolvidas
    this.setProgress(undefined);
  }
}
