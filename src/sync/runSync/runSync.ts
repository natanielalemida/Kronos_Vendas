import {Dispatch, SetStateAction} from 'react';
import {Alert} from 'react-native';
import {UsuarioDto} from '../../modules/login/hooks/type';
import DeleteRepository from './deleteRepositoy';
import SincronizarPagamentos from '../pagamentos/syncPagamentos';
import SincronizarCliente from '../clientes/syncCliente';
import SincronizarProdutos from '../products/syncProducts';
import SincronizarMunicipios from '../municipio/syncMunicipio';
import SincronizarPedidos from '../pedidos';

export default class runSync {
  private setProgress: Dispatch<SetStateAction<{}>>;
  private usuario: UsuarioDto;
  private organizationCode: number;
  private deleteRepository: DeleteRepository;
  private formaPagamentoSync: SincronizarPagamentos;
  private produtosSync: SincronizarProdutos;
  private clienteSync: SincronizarCliente;
  private municipioSync: SincronizarMunicipios;
  private pedidoSync: SincronizarPedidos;

  constructor(
    usuario: UsuarioDto,
    organizationCode: number,
    setProgress: Dispatch<SetStateAction<{}>>,
  ) {
    this.setProgress = setProgress;
    this.usuario = usuario;
    this.organizationCode = organizationCode;
    this.deleteRepository = new DeleteRepository();
    this.municipioSync = new SincronizarMunicipios(
      this.usuario,
      this.organizationCode,
    );
    this.formaPagamentoSync = new SincronizarPagamentos(
      this.usuario,
      this.organizationCode,
    );
    this.produtosSync = new SincronizarProdutos(
      this.usuario,
      this.organizationCode,
    );
    this.clienteSync = new SincronizarCliente(
      this.usuario,
      this.organizationCode,
    );
    this.pedidoSync = new SincronizarPedidos(
      this.usuario,
      this.organizationCode,
    );
  }

  private updateProgress(currentStep: number, totalSteps: number) {
    const progress = (currentStep / totalSteps) * 100;
    return progress;
  }

  async iniciarSincronizacao() {
    const totalSteps = 7;
    let currentStep = 1;

    try {
      this.setProgress({
        message: 'Apagando registros antigos...',
        progress: this.updateProgress(currentStep, totalSteps),
      });

      await this.deleteRepository.deleteAllWithCodigo();

      currentStep++;
      this.setProgress({
        message: 'sincronização de municípios...',
        progress: this.updateProgress(currentStep, totalSteps),
      });

      await this.municipioSync.runSync();

      currentStep++;
      this.setProgress({
        message: 'sincronização de produtos...',
        progress: this.updateProgress(currentStep, totalSteps),
      });

      await this.produtosSync.runSync();

      currentStep++;
      this.setProgress({
        message: 'sincronização de formas de pagamentos...',
        progress: this.updateProgress(currentStep, totalSteps),
      });

      await this.formaPagamentoSync.runSync();

      currentStep++;
      this.setProgress({
        message: 'sincronização de clientes...',
        progress: this.updateProgress(currentStep, totalSteps),
      });

      await this.clienteSync.runSync();

      currentStep++;
      this.setProgress({
        message: 'Sincronizando pedidos',
        progress: this.updateProgress(currentStep, totalSteps),
      });

      await this.pedidoSync.runSync();

      currentStep++;
      this.setProgress({
        message: 'Sincronização concluída!',
        progress: this.updateProgress(currentStep, totalSteps),
      });

      this.setProgress(undefined);
    } catch (er) {
      const error = er as Error;
      Alert.alert(`${error.name}`, `${error.message}`);
    }
  }

  async limparDados() {
    const totalSteps = 7;
    let currentStep = 1;

    try {
      this.setProgress({
        message: 'Apagando registros antigos...',
        progress: this.updateProgress(currentStep, totalSteps),
      });

      await this.deleteRepository.deleteAll();

      currentStep++;
      this.setProgress({
        message: 'sincronização de municípios...',
        progress: this.updateProgress(currentStep, totalSteps),
      });

      await this.municipioSync.runSync();

      currentStep++;
      this.setProgress({
        message: 'sincronização de produtos...',
        progress: this.updateProgress(currentStep, totalSteps),
      });

      await this.produtosSync.runSync();

      currentStep++;
      this.setProgress({
        message: 'sincronização de formas de pagamentos...',
        progress: this.updateProgress(currentStep, totalSteps),
      });

      await this.formaPagamentoSync.runSync();

      currentStep++;
      this.setProgress({
        message: 'sincronização de clientes...',
        progress: this.updateProgress(currentStep, totalSteps),
      });

      await this.clienteSync.runSync();

      currentStep++;
      this.setProgress({
        message: 'Sincronizando pedidos',
        progress: this.updateProgress(currentStep, totalSteps),
      });

      await this.pedidoSync.runSync();

      currentStep++;
      this.setProgress({
        message: 'Sincronização concluída!',
        progress: this.updateProgress(currentStep, totalSteps),
      });

      this.setProgress(undefined);
    } catch (er) {
      const error = er as Error;
      Alert.alert(`${error.name}`, `${error.message}`);
    }
  }
}
