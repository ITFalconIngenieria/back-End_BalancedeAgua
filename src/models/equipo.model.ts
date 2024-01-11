import {belongsTo, Entity, model, property} from '@loopback/repository';
import {TipoEquipo} from './tipo-equipo.model';
import {TipoFuncion} from './tipo-funcion.model';
import {UnidadMedicion} from './unidad-medicion.model';
import {Locacion} from './locacion.model';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'Equipo'}}})
export class Equipo extends Entity {
  @property({
    type: 'number',
    precision: 10,
    scale: 0,
    generated: 1,
    id: 1,
    mssql: {columnName: 'id', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'NO', generated: 1},
  })
  id: number;
  @property({
    type: 'string',
    required: true,
    length: 150,
    generated: 0,
    mssql: {columnName: 'tagName', dataType: 'nvarchar', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'NO', generated: 0},
  })
  tagName: string;

  @property({
    type: 'string',
    required: true,
    length: 300,
    generated: 0,
    mssql: {columnName: 'descripcion', dataType: 'nvarchar', dataLength: 300, dataPrecision: null, dataScale: null, nullable: 'NO', generated: 0},
  })
  descripcion: string;

  @property({
    type: 'boolean',
    required: true,
    generated: 0,
    mssql: {columnName: 'estado', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: 0},
  })
  estado: boolean;

  @belongsTo(() => TipoEquipo, {name: 'tipoEquipoFk'})
  tipoEquipoId: number;

  @belongsTo(() => TipoFuncion, {name: 'tipoFuncionFk'})
  tipoFuncionId: number;

  @belongsTo(() => UnidadMedicion, {name: 'unidadMedicionFk'})
  unidadId: number;

  @belongsTo(() => Locacion, {name: 'locacionFk'})
  locacionId: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Equipo>) {
    super(data);
  }
}

export interface EquipoRelations {
  // describe navigational properties here
}

export type EquipoWithRelations = Equipo & EquipoRelations;
