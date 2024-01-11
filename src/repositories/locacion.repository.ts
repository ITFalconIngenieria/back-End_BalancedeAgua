import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {BalanceAguaDataSource} from '../datasources';
import {Locacion, LocacionRelations, TipoLocacion, Equipo} from '../models';
import {TipoLocacionRepository} from './tipo-locacion.repository';
import {EquipoRepository} from './equipo.repository';

export class LocacionRepository extends DefaultCrudRepository<
  Locacion,
  typeof Locacion.prototype.id,
  LocacionRelations
> {

  public readonly locationFk: BelongsToAccessor<TipoLocacion, typeof Locacion.prototype.id>;

  public readonly locacionsId: HasManyRepositoryFactory<Equipo, typeof Locacion.prototype.id>;

  constructor(
    @inject('datasources.BalanceAgua') dataSource: BalanceAguaDataSource, @repository.getter('TipoLocacionRepository') protected tipoLocacionRepositoryGetter: Getter<TipoLocacionRepository>, @repository.getter('EquipoRepository') protected equipoRepositoryGetter: Getter<EquipoRepository>,
  ) {
    super(Locacion, dataSource);
    this.locacionsId = this.createHasManyRepositoryFactoryFor('locacionsId', equipoRepositoryGetter,);
    this.registerInclusionResolver('locacionsId', this.locacionsId.inclusionResolver);
    this.locationFk = this.createBelongsToAccessorFor('locationFk', tipoLocacionRepositoryGetter,);
    this.registerInclusionResolver('locationFk', this.locationFk.inclusionResolver);
  }
}
