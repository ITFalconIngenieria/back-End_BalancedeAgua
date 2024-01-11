import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {BalanceAguaDataSource} from '../datasources';
import {TipoLocacion, TipoLocacionRelations, Locacion} from '../models';
import {LocacionRepository} from './locacion.repository';

export class TipoLocacionRepository extends DefaultCrudRepository<
  TipoLocacion,
  typeof TipoLocacion.prototype.id,
  TipoLocacionRelations
> {

  public readonly locationsFk: HasManyRepositoryFactory<Locacion, typeof TipoLocacion.prototype.id>;

  constructor(
    @inject('datasources.BalanceAgua') dataSource: BalanceAguaDataSource, @repository.getter('LocacionRepository') protected locacionRepositoryGetter: Getter<LocacionRepository>,
  ) {
    super(TipoLocacion, dataSource);
    this.locationsFk = this.createHasManyRepositoryFactoryFor('locationsFk', locacionRepositoryGetter,);
    this.registerInclusionResolver('locationsFk', this.locationsFk.inclusionResolver);
  }
}
