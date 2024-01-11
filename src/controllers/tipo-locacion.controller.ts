import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {TipoLocacion} from '../models';
import {TipoLocacionRepository} from '../repositories';

export class TipoLocacionController {
  constructor(
    @repository(TipoLocacionRepository)
    public tipoLocacionRepository : TipoLocacionRepository,
  ) {}

  @post('/tipo-locacions')
  @response(200, {
    description: 'TipoLocacion model instance',
    content: {'application/json': {schema: getModelSchemaRef(TipoLocacion)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoLocacion, {
            title: 'NewTipoLocacion',
            exclude: ['id'],
          }),
        },
      },
    })
    tipoLocacion: Omit<TipoLocacion, 'id'>,
  ): Promise<TipoLocacion> {
    return this.tipoLocacionRepository.create(tipoLocacion);
  }

  @get('/tipo-locacions/count')
  @response(200, {
    description: 'TipoLocacion model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TipoLocacion) where?: Where<TipoLocacion>,
  ): Promise<Count> {
    return this.tipoLocacionRepository.count(where);
  }

  @get('/tipo-locacions')
  @response(200, {
    description: 'Array of TipoLocacion model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TipoLocacion, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TipoLocacion) filter?: Filter<TipoLocacion>,
  ): Promise<TipoLocacion[]> {
    return this.tipoLocacionRepository.find(filter);
  }

  @patch('/tipo-locacions')
  @response(200, {
    description: 'TipoLocacion PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoLocacion, {partial: true}),
        },
      },
    })
    tipoLocacion: TipoLocacion,
    @param.where(TipoLocacion) where?: Where<TipoLocacion>,
  ): Promise<Count> {
    return this.tipoLocacionRepository.updateAll(tipoLocacion, where);
  }

  @get('/tipo-locacions/{id}')
  @response(200, {
    description: 'TipoLocacion model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TipoLocacion, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TipoLocacion, {exclude: 'where'}) filter?: FilterExcludingWhere<TipoLocacion>
  ): Promise<TipoLocacion> {
    return this.tipoLocacionRepository.findById(id, filter);
  }

  @patch('/tipo-locacions/{id}')
  @response(204, {
    description: 'TipoLocacion PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoLocacion, {partial: true}),
        },
      },
    })
    tipoLocacion: TipoLocacion,
  ): Promise<void> {
    await this.tipoLocacionRepository.updateById(id, tipoLocacion);
  }

  @put('/tipo-locacions/{id}')
  @response(204, {
    description: 'TipoLocacion PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() tipoLocacion: TipoLocacion,
  ): Promise<void> {
    await this.tipoLocacionRepository.replaceById(id, tipoLocacion);
  }

  @del('/tipo-locacions/{id}')
  @response(204, {
    description: 'TipoLocacion DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.tipoLocacionRepository.deleteById(id);
  }
}
