import {Alert} from 'react-native';

import ApiInstace from '@/api/ApiInstace';
import {CustomerFormService} from '@/modules/customers/services/customer-form.service';
import {normalizeCustomerForm} from '@/modules/customers/helpers/customer-form.helpers';
import {LocalParameter} from '@/modules/settings/types/local-parameter.types';
import {ClienteDto} from '@/modules/sync/types/customer-sync.types';
import {UserDto} from '@/shared/types';
import {CustomerForm} from '@/shared/types/customer-form.types';

import {CustomerUploadMapper} from '../mappers/customer-upload.mapper';
import {SingleCustomerUploadRepository} from '../repositories/single-customer-upload.repository';
import {
  CustomerUploadApiPayload,
  CustomerUploadApiResponse,
  SyncProgress,
} from '../types/customer-upload.types';
import {
  customerUploadApiResponseSchema,
  customerUploadPayloadSchema,
} from '../schemas/customer-upload.schema';
import {syncExecutionContextSchema} from '../schemas/sync.schema';

export class SingleCustomerUploadService {
  private readonly repository = new SingleCustomerUploadRepository();
  private readonly mapper = new CustomerUploadMapper();
  private readonly customerFormService = new CustomerFormService();

  constructor(
    private readonly localParameters: LocalParameter[],
    private readonly user: UserDto,
    private readonly customer: ClienteDto,
    private readonly progressCallback: (value: SyncProgress | undefined) => void,
  ) {}

  private async sendCustomer(payload: CustomerUploadApiPayload) {
    const parsedPayload = customerUploadPayloadSchema.parse(
      payload,
    ) as CustomerUploadApiPayload;
    syncExecutionContextSchema.parse({
      organizationCode: 1,
      userHash: this.user.Hash,
    });

    const response = await ApiInstace.openUrl<
      CustomerUploadApiResponse,
      CustomerUploadApiPayload
    >({
      method: 'post',
      data: parsedPayload,
      headers: {
        Empresa: 1,
        Auth: this.user.Hash,
      },
      endPoint: 'arc/cliente',
    });

    if (!response) {
      throw new Error('Customer sync returned no response.');
    }

    return customerUploadApiResponseSchema.parse(
      response,
    ) as CustomerUploadApiResponse;
  }

  private getFailureMessage(response: CustomerUploadApiResponse) {
    const [firstMessage] = response.Mensagens ?? [];

    return (
      firstMessage?.Conteudo ??
      firstMessage?.conteudo ??
      'Falha ao enviar cliente.'
    );
  }

  private isSuccessfulResponse(response: CustomerUploadApiResponse) {
    return Array.isArray(response.Mensagens);
  }

  private mapCustomerToForm(customer: ClienteDto): CustomerForm {
    const primaryAddress = customer.Enderecos[0];
    const mobileContacts = customer.Contatos.filter(contact => contact.Tipo === 1);
    const emailContacts = customer.Contatos.filter(contact => contact.Tipo === 2);

    return normalizeCustomerForm({
      id: customer.id,
      CNPJCPF: customer.CNPJCPF,
      IE: customer.IERG ?? undefined,
      NomeFantasia: customer.NomeFantasia,
      RazaoSocial: customer.RazaoSocial,
      Endereco: primaryAddress?.Logradouro,
      NumeroEndereco: primaryAddress?.Numero,
      Bairro: primaryAddress?.Bairro,
      Logradouro: primaryAddress?.Logradouro,
      Complemento: primaryAddress?.Complemento,
      Municipio: primaryAddress?.Municipio
        ? {
            Codigo: primaryAddress.Municipio.Codigo,
            Estado: primaryAddress.Municipio.UFSigla ?? undefined,
            MunicipioCodigo:
              primaryAddress.Municipio.MunicipioCodigo ?? undefined,
            MunicipioNome: primaryAddress.Municipio.MunicipioNome ?? '',
          }
        : undefined,
      Celular: mobileContacts,
      Email: emailContacts,
      CEP: primaryAddress?.CEP ?? undefined,
      IsSincronizado: customer.isSincronizado,
    });
  }

  async syncSingleCustomer(initSync: boolean) {
    this.progressCallback({message: 'Iniciando sincronização...', progress: 0});

    const shouldSyncAndSave = this.localParameters.find(
      parameter => parameter.Descricao === 'UsarApenasOnline',
    );
    const payload = this.mapper.mapCustomerFormPayload(this.customer, this.user);

    if (shouldSyncAndSave) {
      this.progressCallback({message: 'Enviando para o servidor', progress: 0.4});

      const response = await this.sendCustomer(payload);

      if (!this.isSuccessfulResponse(response)) {
        this.progressCallback(undefined);
        Alert.alert('Falha', this.getFailureMessage(response));
        return;
      }

      const existingAddressId = await this.repository.getExistingAddressIdByCode(
        response.Resultado.Codigo,
      );

      if (existingAddressId) {
        const savedCustomer = await this.repository.saveSyncedCustomer(
          response.Resultado,
          this.customer.id,
          existingAddressId,
        );
        this.progressCallback(undefined);
        return savedCustomer;
      }

      this.progressCallback({message: 'Salvando cliente', progress: 0.8});

      const insertedCustomer = await this.repository.insertSyncedCustomer(
        response.Resultado,
      );
      this.progressCallback(undefined);
      return insertedCustomer;
    }

    this.progressCallback({message: 'salvando', progress: 0.4});

    if (!initSync) {
      const savedCustomer = await this.customerFormService.saveOrUpdate(
        this.mapCustomerToForm(this.customer),
      );
      this.progressCallback(undefined);
      return savedCustomer;
    }

    const response = await this.sendCustomer(payload);

    if (!this.isSuccessfulResponse(response)) {
      this.progressCallback(undefined);
      Alert.alert('Falha', this.getFailureMessage(response));
      return;
    }

    const existingAddressId = await this.repository.getExistingAddressIdById(
      this.customer.id,
    );

    if (this.customer.id) {
      const savedCustomer = await this.repository.saveSyncedCustomer(
        response.Resultado,
        this.customer.id,
        existingAddressId,
      );
      this.progressCallback(undefined);
      return savedCustomer;
    }

    const insertedCustomer = await this.repository.insertSyncedCustomer(
      response.Resultado,
    );
    this.progressCallback(undefined);
    return insertedCustomer;
  }
}
