import {Alert} from 'react-native';

import {UserDto} from '@/shared/types';
import {AppStorageGateway} from '@/modules/storage/services/app-storage.gateway';

import {CustomerUploadService} from './customer-upload.service';
import {SyncSessionService} from './sync-session.service';
import {CustomerUploadRepository} from '../repositories/customer-upload.repository';
import {CustomerSyncRepository} from '../repositories/customer-sync.repository';
import {LocalDataResetRepository} from '../repositories/local-data-reset.repository';
import {MunicipalitySyncRepository} from '../repositories/municipality-sync.repository';
import {OrderSyncRepository} from '../repositories/order-sync.repository';
import {PaymentMethodSyncRepository} from '../repositories/payment-method-sync.repository';
import {ProductImageSyncRepository} from '../repositories/product-image-sync.repository';
import {ProductSyncRepository} from '../repositories/product-sync.repository';
import {SyncApiRepository} from '../repositories/sync-api.repository';
import {SyncMetadataRepository} from '../repositories/sync-metadata.repository';
import {
  SyncRunMode,
  SyncStepDefinition,
  SyncStepRunResult,
} from '../types/sync-run.types';
import {CustomerSyncService} from './customer-sync.service';
import {MunicipalitySyncService} from './municipality-sync.service';
import {OrderSyncService} from './order-sync.service';
import {PaymentMethodSyncService} from './payment-method-sync.service';
import {ProductImageSyncService} from './product-image-sync.service';
import {ProductSyncService} from './product-sync.service';

export class SyncWorkflowService {
  private readonly syncSessionService = new SyncSessionService();
  private readonly syncApiRepository = new SyncApiRepository();
  private readonly localDataResetRepository = new LocalDataResetRepository();
  private readonly syncMetadataRepository = new SyncMetadataRepository();
  private readonly customerUploadService = new CustomerUploadService(
    new CustomerUploadRepository(),
  );
  private readonly municipalitySyncService = new MunicipalitySyncService(
    this.syncApiRepository,
    new MunicipalitySyncRepository(),
  );
  private readonly productSyncService = new ProductSyncService(
    this.syncApiRepository,
    new ProductSyncRepository(),
  );
  private readonly paymentMethodSyncService = new PaymentMethodSyncService(
    this.syncApiRepository,
    new PaymentMethodSyncRepository(),
  );
  private readonly customerSyncService = new CustomerSyncService(
    this.syncApiRepository,
    new CustomerSyncRepository(),
  );
  private readonly orderSyncService = new OrderSyncService(
    this.syncApiRepository,
    new OrderSyncRepository(),
  );
  private readonly productImageSyncService = new ProductImageSyncService(
    this.syncApiRepository,
    new ProductImageSyncRepository(),
  );

  private normalizeError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }

    if (typeof error === 'string' && error.trim().length > 0) {
      return new Error(error);
    }

    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof error.message === 'string' &&
      error.message.trim().length > 0
    ) {
      return new Error(error.message);
    }

    return new Error('Erro inesperado na sincronização.');
  }

  async run(
    mode: SyncRunMode,
    user: UserDto,
    organizationCode: number,
  ): Promise<void> {
    const steps = await this.createSteps(mode, user, organizationCode);

    this.syncSessionService.startRun(mode, steps);

    try {
      for (const step of steps) {
        this.syncSessionService.startStep(step.id, step.label);

        try {
          const result = await step.run();
          this.syncSessionService.finishStep(step.id, result);
        } catch (error) {
          const normalizedError = this.normalizeError(error);
          const errorTitle = normalizedError.name || 'Erro de sincronização';

          this.syncSessionService.failStep(step.id, normalizedError.message);
          this.syncSessionService.failRun(normalizedError.message);
          Alert.alert(errorTitle, normalizedError.message);
          throw normalizedError;
        }
      }

      await this.syncMetadataRepository.saveLastSuccessfulSyncAt(
        new Date().toISOString(),
      );

      this.syncSessionService.completeRun('Sincronização concluída.');
    } finally {
      if (mode !== 'sync-images') {
        await AppStorageGateway.ensureHydrated();
      }
    }
  }

  private async createSteps(
    mode: SyncRunMode,
    user: UserDto,
    organizationCode: number,
  ): Promise<SyncStepDefinition[]> {
    if (mode === 'sync-images') {
      return [
        {
          id: 'product-images',
          label: 'Sincronizando imagens dos produtos',
          run: () => this.productImageSyncService.sync(user, organizationCode),
        },
      ];
    }

    const shouldSyncProductImages =
      (await AppStorageGateway.getSyncProductImagesEnabled()) ?? false;

    const steps: SyncStepDefinition[] = [
      {
        id:
          mode === 'reset-and-sync'
            ? 'clear-all-local-records'
            : 'clear-synced-records',
        label:
          mode === 'reset-and-sync'
            ? 'Limpando todos os registros locais'
            : 'Limpando registros locais sincronizados',
        run: async (): Promise<SyncStepRunResult> => {
          if (mode === 'reset-and-sync') {
            await this.localDataResetRepository.clearAllRecords();
            return {message: 'Todos os registros locais foram removidos.'};
          }

          await this.localDataResetRepository.clearSyncedRecords();
          return {message: 'Os registros locais sincronizados foram removidos.'};
        },
      },
    ];

    if (mode === 'sync-all') {
      steps.push({
        id: 'upload-pending-customers',
        label: 'Enviando clientes pendentes',
        run: async (): Promise<SyncStepRunResult> => {
          const result =
            await this.customerUploadService.uploadPendingCustomers(
              user,
              organizationCode,
            );

          return {
            itemCount: result.uploadedCustomersCount,
            message:
              result.uploadedCustomersCount > 0
                ? 'Clientes pendentes enviados.'
                : 'Nenhum cliente pendente para enviar.',
            skipped: result.uploadedCustomersCount === 0,
          };
        },
      });
    }

    steps.push(
      {
        id: 'municipalities',
        label: 'Sincronizando municípios',
        run: () =>
          this.municipalitySyncService.sync(user, organizationCode, mode),
      },
      {
        id: 'products',
        label: 'Sincronizando produtos',
        run: () => this.productSyncService.sync(user, organizationCode),
      },
      {
        id: 'payment-methods',
        label: 'Sincronizando formas de pagamento',
        run: () => this.paymentMethodSyncService.sync(user, organizationCode),
      },
      {
        id: 'customers',
        label: 'Sincronizando clientes',
        run: () => this.customerSyncService.sync(user, organizationCode),
      },
      {
        id: 'orders',
        label: 'Sincronizando pedidos',
        run: () => this.orderSyncService.sync(user, organizationCode),
      },
    );

    if (shouldSyncProductImages) {
      steps.push({
        id: 'product-images',
        label: 'Sincronizando imagens dos produtos',
        run: () => this.productImageSyncService.sync(user, organizationCode),
      });
    }

    return steps;
  }
}
