import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {BalanceAguaDataSource} from '../datasources';
import {Equipo, TipoEquipo, TipoEquipoRelations} from '../models';
import {EquipoRepository} from './equipo.repository';

export class TipoEquipoRepository extends DefaultCrudRepository<
  TipoEquipo,
  typeof TipoEquipo.prototype.id,
  TipoEquipoRelations
> {

  public readonly tipoEquiposFk: HasManyRepositoryFactory<Equipo, typeof TipoEquipo.prototype.id>;

  constructor(
    @inject('datasources.BalanceAgua') dataSource: BalanceAguaDataSource, @repository.getter('EquipoRepository') protected equipoRepositoryGetter: Getter<EquipoRepository>,
  ) {
    super(TipoEquipo, dataSource);
    this.tipoEquiposFk = this.createHasManyRepositoryFactoryFor('tipoEquiposFk', equipoRepositoryGetter,);
    this.registerInclusionResolver('tipoEquiposFk', this.tipoEquiposFk.inclusionResolver);
  }
}
