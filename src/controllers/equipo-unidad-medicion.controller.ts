import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Equipo,
  UnidadMedicion,
} from '../models';
import {EquipoRepository} from '../repositories';

export class EquipoUnidadMedicionController {
  constructor(
    @repository(EquipoRepository)
    public equipoRepository: EquipoRepository,
  ) { }

  @get('/equipos/{id}/unidad-medicion', {
    responses: {
      '200': {
        description: 'UnidadMedicion belonging to Equipo',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(UnidadMedicion)},
          },
        },
      },
    },
  })
  async getUnidadMedicion(
    @param.path.number('id') id: typeof Equipo.prototype.id,
  ): Promise<UnidadMedicion> {
    return this.equipoRepository.unidadMedicionFk(id);
  }
}
