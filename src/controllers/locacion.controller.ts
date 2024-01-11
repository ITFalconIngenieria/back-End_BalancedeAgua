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
import {Locacion} from '../models';
import {LocacionRepository} from '../repositories';

export class LocacionController {
  constructor(
    @repository(LocacionRepository)
    public locacionRepository : LocacionRepository,
  ) {}

  @post('/locacions')
  @response(200, {
    description: 'Locacion model instance',
    content: {'application/json': {schema: getModelSchemaRef(Locacion)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Locacion, {
            title: 'NewLocacion',
            exclude: ['id'],
          }),
        },
      },
    })
    locacion: Omit<Locacion, 'id'>,
  ): Promise<Locacion> {
    return this.locacionRepository.create(locacion);
  }

  @get('/locacions/count')
  @response(200, {
    description: 'Locacion model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Locacion) where?: Where<Locacion>,
  ): Promise<Count> {
    return this.locacionRepository.count(where);
  }

  @get('/locacions')
  @response(200, {
    description: 'Array of Locacion model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Locacion, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Locacion) filter?: Filter<Locacion>,
  ): Promise<Locacion[]> {
    return this.locacionRepository.find(filter);
  }

  @patch('/locacions')
  @response(200, {
    description: 'Locacion PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Locacion, {partial: true}),
        },
      },
    })
    locacion: Locacion,
    @param.where(Locacion) where?: Where<Locacion>,
  ): Promise<Count> {
    return this.locacionRepository.updateAll(locacion, where);
  }

  @get('/locacions/{id}')
  @response(200, {
    description: 'Locacion model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Locacion, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Locacion, {exclude: 'where'}) filter?: FilterExcludingWhere<Locacion>
  ): Promise<Locacion> {
    return this.locacionRepository.findById(id, filter);
  }

  @patch('/locacions/{id}')
  @response(204, {
    description: 'Locacion PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Locacion, {partial: true}),
        },
      },
    })
    locacion: Locacion,
  ): Promise<void> {
    await this.locacionRepository.updateById(id, locacion);
  }

  @put('/locacions/{id}')
  @response(204, {
    description: 'Locacion PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() locacion: Locacion,
  ): Promise<void> {
    await this.locacionRepository.replaceById(id, locacion);
  }

  @del('/locacions/{id}')
  @response(204, {
    description: 'Locacion DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.locacionRepository.deleteById(id);
  }
}
