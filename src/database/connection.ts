import {knex, RNSqliteDialect} from 'knex-react-native-sqlite';

export const knexConfig = knex({
  client: RNSqliteDialect,
  connection: {
    name: 'KronosVendas.db',
    location: 'default',
  },
  useNullAsDefault: true,
});
