import {ensureMunicipalityVersionSchemaMigration} from '@/database/migration/ensureMunicipalityVersionSchemaMigration';
import {createCategoriaTable} from '@/database/migration/createCategoriaMigration';
import {createPessoaTable} from '@/database/migration/createClienteMigration';
import {createCondicaoPagamentoTable} from '@/database/migration/createCondicaoPagamento';
import {createContatoTable} from '@/database/migration/createContatoMigration';
import {createEnderecoTable} from '@/database/migration/createEnderecoMigration';
import {createFormaPagamentoTable} from '@/database/migration/createFormaPagamento';
import {
  createEmpresaJson,
  createPrivilegiosMigration,
  createUsuariosMigration,
} from '@/database/migration/createLoginMigration';
import {createLocalParamsSettings} from '@/database/migration/createLocalParamsSettings';
import {createMunicipioTable} from '@/database/migration/createMunicipioMigration';
import {createMunicipalityVersionTableMigration} from '@/database/migration/createMunicipalityVersionTableMigration';
import {createPedidoTable} from '@/database/migration/createPedidoMigration';
import {createPedidoVinculoMeioPagamentoTable} from '@/database/migration/createPedidoVinculoMeioPagamentoMigration';
import {createPedidoVinculoProdutoTable} from '@/database/migration/createPedidoVinculoProdutoMigration';
import {createProductsImageMigration} from '@/database/migration/createProducImageMigration';
import {createProductsMigration} from '@/database/migration/createProductsMigration';
import {createRegiaoTable} from '@/database/migration/CreateReigaoMigration';
import {createSettingsTable} from '@/database/migration/createSettingsMigration';

import {MigrationRepository} from '../repositories/migration.repository';
import {MigrationService} from '../services/migration.service';
import {DatabaseMigrationDefinition} from '../types/migration.types';

const databaseMigrations: DatabaseMigrationDefinition[] = [
  {
    id: '001-settings',
    description: 'Create settings table',
    run: createSettingsTable,
  },
  {
    id: '002-products',
    description: 'Create products table',
    run: createProductsMigration,
  },
  {
    id: '003-payment-methods',
    description: 'Create payment methods table',
    run: createFormaPagamentoTable,
  },
  {
    id: '004-payment-conditions',
    description: 'Create payment conditions table',
    run: createCondicaoPagamentoTable,
  },
  {
    id: '005-categories',
    description: 'Create category table',
    run: createCategoriaTable,
  },
  {
    id: '006-regions',
    description: 'Create region table',
    run: createRegiaoTable,
  },
  {
    id: '007-customers',
    description: 'Create customer table',
    run: createPessoaTable,
  },
  {
    id: '008-municipalities',
    description: 'Create municipality table',
    run: createMunicipioTable,
  },
  {
    id: '009-addresses',
    description: 'Create address table',
    run: createEnderecoTable,
  },
  {
    id: '010-local-parameters',
    description: 'Create local parameters table',
    run: createLocalParamsSettings,
  },
  {
    id: '011-contacts',
    description: 'Create contact table',
    run: createContatoTable,
  },
  {
    id: '012-orders',
    description: 'Create order table',
    run: createPedidoTable,
  },
  {
    id: '013-order-payment-links',
    description: 'Create order payment link table',
    run: createPedidoVinculoMeioPagamentoTable,
  },
  {
    id: '014-order-product-links',
    description: 'Create order product link table',
    run: createPedidoVinculoProdutoTable,
  },
  {
    id: '015-product-images',
    description: 'Create product image table',
    run: createProductsImageMigration,
  },
  {
    id: '016-users',
    description: 'Create local user table',
    run: createUsuariosMigration,
  },
  {
    id: '017-privileges',
    description: 'Create privilege table',
    run: createPrivilegiosMigration,
  },
  {
    id: '018-company-login',
    description: 'Create company login table',
    run: createEmpresaJson,
  },
  {
    id: '019-municipality-version',
    description: 'Create municipality version table',
    run: createMunicipalityVersionTableMigration,
  },
  {
    id: '020-municipality-version-schema-sync',
    description: 'Ensure municipality version schema is up to date',
    run: ensureMunicipalityVersionSchemaMigration,
  },
];

export class DatabaseController {
  private readonly migrationService: MigrationService;

  constructor() {
    this.migrationService = new MigrationService(
      new MigrationRepository(),
      databaseMigrations,
    );
  }

  async initialize(): Promise<void> {
    await this.migrationService.runPendingMigrations();
  }
}
