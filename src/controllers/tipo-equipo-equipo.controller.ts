import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  Equipo, TipoEquipo
} from '../models';
import {TipoEquipoRepository} from '../repositories';

export class TipoEquipoEquipoController {
  constructor(
    @repository(TipoEquipoRepository) protected tipoEquipoRepository: TipoEquipoRepository,
  ) { }

  @get('/tipo-equipos/{id}/equipos', {
    responses: {
      '200': {
        description: 'Array of TipoEquipo has many Equipo',
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
    return this.tipoEquipoRepository.tipoEquiposFk(id).find(filter);
  }

  @post('/tipo-equipos/{id}/equipos', {
    responses: {
      '200': {
        description: 'TipoEquipo model instance',
        content: {'application/json': {schema: getModelSchemaRef(Equipo)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof TipoEquipo.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Equipo, {
            title: 'NewEquipoInTipoEquipo',
            exclude: ['id'],
            optional: ['tipoEquipoId']
          }),
        },
      },
    }) equipo: Omit<Equipo, 'id'>,
  ): Promise<Equipo> {
    return this.tipoEquipoRepository.tipoEquiposFk(id).create(equipo);
  }

  @patch('/tipo-equipos/{id}/equipos', {
    responses: {
      '200': {
        description: 'TipoEquipo.Equipo PATCH success count',
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
    return this.tipoEquipoRepository.tipoEquiposFk(id).patch(equipo, where);
  }

  @del('/tipo-equipos/{id}/equipos', {
    responses: {
      '200': {
        description: 'TipoEquipo.Equipo DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Equipo)) where?: Where<Equipo>,
  ): Promise<Count> {
    return this.tipoEquipoRepository.tipoEquiposFk(id).delete(where);
  }
}
