import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {BalanceAguaDataSource} from '../datasources';
import {UnidadMedicion, UnidadMedicionRelations, Equipo} from '../models';
import {EquipoRepository} from './equipo.repository';

export class UnidadMedicionRepository extends DefaultCrudRepository<
  UnidadMedicion,
  typeof UnidadMedicion.prototype.id,
  UnidadMedicionRelations
> {

  public readonly unidadMedicionFk: HasManyRepositoryFactory<Equipo, typeof UnidadMedicion.prototype.id>;

  constructor(
    @inject('datasources.BalanceAgua') dataSource: BalanceAguaDataSource, @repository.getter('EquipoRepository') protected equipoRepositoryGetter: Getter<EquipoRepository>,
  ) {
    super(UnidadMedicion, dataSource);
    this.unidadMedicionFk = this.createHasManyRepositoryFactoryFor('unidadMedicionFk', equipoRepositoryGetter,);
    this.registerInclusionResolver('unidadMedicionFk', this.unidadMedicionFk.inclusionResolver);
  }
}
