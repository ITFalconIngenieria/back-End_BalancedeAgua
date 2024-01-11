import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {BalanceAguaDataSource} from '../datasources';
import {Equipo, EquipoRelations, TipoEquipo, TipoFuncion, UnidadMedicion, Locacion} from '../models';
import {TipoEquipoRepository} from './tipo-equipo.repository';
import {TipoFuncionRepository} from './tipo-funcion.repository';
import {UnidadMedicionRepository} from './unidad-medicion.repository';
import {LocacionRepository} from './locacion.repository';

export class EquipoRepository extends DefaultCrudRepository<
  Equipo,
  typeof Equipo.prototype.id,
  EquipoRelations
> {

  public readonly tipoEquipoFk: BelongsToAccessor<TipoEquipo, typeof Equipo.prototype.id>;

  public readonly tipoFuncionFk: BelongsToAccessor<TipoFuncion, typeof Equipo.prototype.id>;

  public readonly unidadMedicionFk: BelongsToAccessor<UnidadMedicion, typeof Equipo.prototype.id>;

  public readonly locacionFk: BelongsToAccessor<Locacion, typeof Equipo.prototype.id>;

  constructor(
    @inject('datasources.BalanceAgua') dataSource: BalanceAguaDataSource, @repository.getter('TipoEquipoRepository') protected tipoEquipoRepositoryGetter: Getter<TipoEquipoRepository>, @repository.getter('TipoFuncionRepository') protected tipoFuncionRepositoryGetter: Getter<TipoFuncionRepository>, @repository.getter('UnidadMedicionRepository') protected unidadMedicionRepositoryGetter: Getter<UnidadMedicionRepository>, @repository.getter('LocacionRepository') protected locacionRepositoryGetter: Getter<LocacionRepository>,
  ) {
    super(Equipo, dataSource);
    this.locacionFk = this.createBelongsToAccessorFor('locacionFk', locacionRepositoryGetter,);
    this.registerInclusionResolver('locacionFk', this.locacionFk.inclusionResolver);
    this.unidadMedicionFk = this.createBelongsToAccessorFor('unidadMedicionFk', unidadMedicionRepositoryGetter,);
    this.registerInclusionResolver('unidadMedicionFk', this.unidadMedicionFk.inclusionResolver);
    this.tipoFuncionFk = this.createBelongsToAccessorFor('tipoFuncionFk', tipoFuncionRepositoryGetter,);
    this.registerInclusionResolver('tipoFuncionFk', this.tipoFuncionFk.inclusionResolver);
    this.tipoEquipoFk = this.createBelongsToAccessorFor('tipoEquipoFk', tipoEquipoRepositoryGetter,);
    this.registerInclusionResolver('tipoEquipoFk', this.tipoEquipoFk.inclusionResolver);
  }
}
