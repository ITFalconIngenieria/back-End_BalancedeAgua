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
  TipoFuncion,
  Equipo,
} from '../models';
import {TipoFuncionRepository} from '../repositories';

export class TipoFuncionEquipoController {
  constructor(
    @repository(TipoFuncionRepository) protected tipoFuncionRepository: TipoFuncionRepository,
  ) { }

  @get('/tipo-funcions/{id}/equipos', {
    responses: {
      '200': {
        description: 'Array of TipoFuncion has many Equipo',
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
    return this.tipoFuncionRepository.tipoFuncionsFk(id).find(filter);
  }

  @post('/tipo-funcions/{id}/equipos', {
    responses: {
      '200': {
        description: 'TipoFuncion model instance',
        content: {'application/json': {schema: getModelSchemaRef(Equipo)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof TipoFuncion.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Equipo, {
            title: 'NewEquipoInTipoFuncion',
            exclude: ['id'],
            optional: ['tipoFuncionId']
          }),
        },
      },
    }) equipo: Omit<Equipo, 'id'>,
  ): Promise<Equipo> {
    return this.tipoFuncionRepository.tipoFuncionsFk(id).create(equipo);
  }

  @patch('/tipo-funcions/{id}/equipos', {
    responses: {
      '200': {
        description: 'TipoFuncion.Equipo PATCH success count',
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
    return this.tipoFuncionRepository.tipoFuncionsFk(id).patch(equipo, where);
  }

  @del('/tipo-funcions/{id}/equipos', {
    responses: {
      '200': {
        description: 'TipoFuncion.Equipo DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Equipo)) where?: Where<Equipo>,
  ): Promise<Count> {
    return this.tipoFuncionRepository.tipoFuncionsFk(id).delete(where);
  }
}
