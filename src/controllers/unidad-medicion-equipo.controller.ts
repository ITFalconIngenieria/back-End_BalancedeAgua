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
  UnidadMedicion,
  Equipo,
} from '../models';
import {UnidadMedicionRepository} from '../repositories';

export class UnidadMedicionEquipoController {
  constructor(
    @repository(UnidadMedicionRepository) protected unidadMedicionRepository: UnidadMedicionRepository,
  ) { }

  @get('/unidad-medicions/{id}/equipos', {
    responses: {
      '200': {
        description: 'Array of UnidadMedicion has many Equipo',
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
    return this.unidadMedicionRepository.unidadMedicionFk(id).find(filter);
  }

  @post('/unidad-medicions/{id}/equipos', {
    responses: {
      '200': {
        description: 'UnidadMedicion model instance',
        content: {'application/json': {schema: getModelSchemaRef(Equipo)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof UnidadMedicion.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Equipo, {
            title: 'NewEquipoInUnidadMedicion',
            exclude: ['id'],
            optional: ['unidadId']
          }),
        },
      },
    }) equipo: Omit<Equipo, 'id'>,
  ): Promise<Equipo> {
    return this.unidadMedicionRepository.unidadMedicionFk(id).create(equipo);
  }

  @patch('/unidad-medicions/{id}/equipos', {
    responses: {
      '200': {
        description: 'UnidadMedicion.Equipo PATCH success count',
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
    return this.unidadMedicionRepository.unidadMedicionFk(id).patch(equipo, where);
  }

  @del('/unidad-medicions/{id}/equipos', {
    responses: {
      '200': {
        description: 'UnidadMedicion.Equipo DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Equipo)) where?: Where<Equipo>,
  ): Promise<Count> {
    return this.unidadMedicionRepository.unidadMedicionFk(id).delete(where);
  }
}
