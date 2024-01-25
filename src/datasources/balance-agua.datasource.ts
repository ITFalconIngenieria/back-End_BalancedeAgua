import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';


// const config = {
//   name: 'BalanceAgua',
//   connector: 'mssql',
//   url: 'mssql://EnergyMaster:Control1*@10.120.63.6/BalanceAgua',
//   host: '10.120.63.6',
//   port: 1433,
//   user: 'EnergyMaster',
//   password: 'Control1*',
//   database: 'BalanceAgua',
//   dialectOptions: {
//     requestTimeout: 600000

//   },
// };

const config = {
  name: 'BalanceAgua',
  connector: 'mssql',
  url: 'mssql://sa:control1*@LAPTOPIT/BalanceAgua',
  host: 'LAPTOPIT',
  port: 1433,
  user: 'sa',
  password: 'control1*',
  database: 'BalanceAgua',
  dialectOptions: {
    requestTimeout: 300000
  },
};


// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class BalanceAguaDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'BalanceAgua';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.BalanceAgua', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
