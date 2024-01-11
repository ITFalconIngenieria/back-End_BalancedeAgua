import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Locacion,
  Equipo,
} from '../models';
import {LocacionRepository} from '../repositories';

export class LocacionEquipoController {
  constructor(
    @repository(LocacionRepository) protected locacionRepository: LocacionRepository,
  ) { }

  @get('/locacions/{id}/equipos', {
    responses: {
      '200': {
        description: 'Array of Locacion has many Equipo',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Equipo)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Equipo>,
  ): Promise<Equipo[]> {
    return this.locacionRepository.locacionsId(id).find(filter);
  }

  @post('/locacions/{id}/equipos', {
    responses: {
      '200': {
        description: 'Locacion model instance',
        content: {'application/json': {schema: getModelSchemaRef(Equipo)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Locacion.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Equipo, {
            title: 'NewEquipoInLocacion',
            exclude: ['id'],
            optional: ['locacionId']
          }),
        },
      },
    }) equipo: Omit<Equipo, 'id'>,
  ): Promise<Equipo> {
    return this.locacionRepository.locacionsId(id).create(equipo);
  }

  @patch('/locacions/{id}/equipos', {
    responses: {
      '200': {
        description: 'Locacion.Equipo PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Equipo, {partial: true}),
        },
      },
    })
    equipo: Partial<Equipo>,
    @param.query.object('where', getWhereSchemaFor(Equipo)) where?: Where<Equipo>,
  ): Promise<Count> {
    return this.locacionRepository.locacionsId(id).patch(equipo, where);
  }

  @del('/locacions/{id}/equipos', {
    responses: {
      '200': {
        description: 'Locacion.Equipo DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Equipo)) where?: Where<Equipo>,
  ): Promise<Count> {
    return this.locacionRepository.locacionsId(id).delete(where);
  }
}
