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
  TipoFuncion,
} from '../models';
import {EquipoRepository} from '../repositories';

export class EquipoTipoFuncionController {
  constructor(
    @repository(EquipoRepository)
    public equipoRepository: EquipoRepository,
  ) { }

  @get('/equipos/{id}/tipo-funcion', {
    responses: {
      '200': {
        description: 'TipoFuncion belonging to Equipo',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TipoFuncion)},
          },
        },
      },
    },
  })
  async getTipoFuncion(
    @param.path.number('id') id: typeof Equipo.prototype.id,
  ): Promise<TipoFuncion> {
    return this.equipoRepository.tipoFuncionFk(id);
  }
}
