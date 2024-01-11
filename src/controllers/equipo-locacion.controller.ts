import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
  response,
} from '@loopback/rest';
import {
  Equipo,
  Locacion,
} from '../models';
import { EquipoRepository } from '../repositories';
import { ConsultaEquipos, ConsultaPlantas, LecturasEquipos } from '../Core/Interfaces/Datos.interface';
import { ConsumoService } from '../services';
import { inject } from '@loopback/core';

export class EquipoLocacionController {
  constructor(
    @repository(EquipoRepository)
    public equipoRepository: EquipoRepository,
    @inject('services.ConsumoService') // Corregir el nombre del servicio
    public service: ConsumoService
  ) { }

  @get('/equipos/{id}/locacion', {
    responses: {
      '200': {
        description: 'Locacion belonging to Equipo',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Locacion)},
          },
        },
      },
    },
  })
  async getLocacion(
    @param.path.number('id') id: typeof Equipo.prototype.id,
  ): Promise<Locacion> {
    return this.equipoRepository.locacionFk(id);
  }

  @get('/plantas')
  @response(200, {
  description: 'Array of ConsultaPlantas instances',
  content: {
      'application/json': {
      schema: {
          type: 'array',
          items: {
          type: 'object',
          properties: {
              id: { type: 'number' },
              descripcion: { type: 'string' },
          },
          },
      },
      },
  },
  })
  async ObtenerPlanta(): Promise<ConsultaPlantas[]> {
    return this.service.ObtenerPlantas();
  }


  @get('/equiposxPlanta')
  @response(200, {
  description: 'Array of ConsultaEquipos instances',
  content: {
      'application/json': {
      schema: {
          type: 'array',
          items: {
          type: 'object',
          properties: {
              id: { type: 'number' },
              descripcion: { type: 'string' },
              tag:{type:'string'}
          },
          },
      },
      },
  },
  })
  async ObtenerEquipos(
    @param.query.string('plantaDescripcion') plantaDescripcion: string,
  ): Promise<ConsultaEquipos[]> {
    return this.service.ObtenerEquipos(plantaDescripcion);
  }

  @get('/lecturasXEquipo')
  @response(200, {
    description: 'Array of ConsultaLecturasXEquipo instances',
    content: {
        'application/json': {
        schema: {
            type: 'array',
            items: {
            type: 'object',
            properties: {
                tag:{type:'string'},
                valorInicio: {type:'number'},
                valorFinal: {type:'number'},
                consumo: {type:'number'},
            },
            },
        },
        },
    },
    })
  async ObtenerLecutasXPlanta(
    @param.query.string('tag') tag: string,
    @param.query.string('f1') f1: Date,
    @param.query.string('f2') f2: Date,
  ): Promise<LecturasEquipos[]> {
    return this.service.LecturasXMedidor(f1 ,f2, tag)
  }

}
