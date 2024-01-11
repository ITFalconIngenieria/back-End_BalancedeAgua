import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {BalanceAguaDataSource} from '../datasources';
import {TipoFuncion, TipoFuncionRelations, Equipo} from '../models';
import {EquipoRepository} from './equipo.repository';

export class TipoFuncionRepository extends DefaultCrudRepository<
  TipoFuncion,
  typeof TipoFuncion.prototype.id,
  TipoFuncionRelations
> {

  public readonly tipoFuncionsFk: HasManyRepositoryFactory<Equipo, typeof TipoFuncion.prototype.id>;

  constructor(
    @inject('datasources.BalanceAgua') dataSource: BalanceAguaDataSource, @repository.getter('EquipoRepository') protected equipoRepositoryGetter: Getter<EquipoRepository>,
  ) {
    super(TipoFuncion, dataSource);
    this.tipoFuncionsFk = this.createHasManyRepositoryFactoryFor('tipoFuncionsFk', equipoRepositoryGetter,);
    this.registerInclusionResolver('tipoFuncionsFk', this.tipoFuncionsFk.inclusionResolver);
  }
}
