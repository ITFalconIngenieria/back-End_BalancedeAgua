import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {
  Equipo,
  TipoEquipo
} from '../models';
import {EquipoRepository} from '../repositories';

export class EquipoTipoEquipoController {
  constructor(
    @repository(EquipoRepository)
    public equipoRepository: EquipoRepository,
  ) { }

  @get('/equipos/{id}/tipo-equipo', {
    responses: {
      '200': {
        description: 'TipoEquipo belonging to Equipo',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TipoEquipo)},
          },
        },
      },
    },
  })
  async getTipoEquipo(
    @param.path.number('id') id: typeof Equipo.prototype.id,
  ): Promise<TipoEquipo> {
    return this.equipoRepository.tipoEquipoFk(id);
  }
}
