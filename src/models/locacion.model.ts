import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {TipoLocacion} from './tipo-locacion.model';
import {Equipo} from './equipo.model';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'Locacion'}}})
export class Locacion extends Entity {
  @property({
    type: 'number',
    precision: 10,
    scale: 0,
    generated: 1,
    id: 1,
    mssql: {columnName: 'id', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'NO', generated: 1},
  })
  id?: number;
  @property({
    type: 'number',
    required: true,
    precision: 10,
    scale: 0,
    generated: 0,
    mssql: {columnName: 'descripcion', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'NO', generated: 0},
  })
  descripcion: number;

  @property({
    type: 'number',
    required: true,
    precision: 10,
    scale: 0,
    generated: 0,
    mssql: {columnName: 'observacion', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'NO', generated: 0},
  })
  observacion: number;

  @property({
    type: 'boolean',
    required: true,
    generated: 0,
    mssql: {columnName: 'estado', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: 0},
  })
  estado: boolean;

  @belongsTo(() => TipoLocacion, {name: 'locationFk'})
  tipoLocacionId: number;

  @hasMany(() => Equipo)
  locacionsId: Equipo[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Locacion>) {
    super(data);
  }
}

export interface LocacionRelations {
  // describe navigational properties here
}

export type LocacionWithRelations = Locacion & LocacionRelations;
