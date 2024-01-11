import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Locacion,
  TipoLocacion,
} from '../models';
import {LocacionRepository} from '../repositories';

export class LocacionTipoLocacionController {
  constructor(
    @repository(LocacionRepository)
    public locacionRepository: LocacionRepository,
  ) { }

  @get('/locacions/{id}/tipo-locacion', {
    responses: {
      '200': {
        description: 'TipoLocacion belonging to Locacion',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TipoLocacion)},
          },
        },
      },
    },
  })
  async getTipoLocacion(
    @param.path.number('id') id: typeof Locacion.prototype.id,
  ): Promise<TipoLocacion> {
    return this.locacionRepository.locationFk(id);
  }
}
