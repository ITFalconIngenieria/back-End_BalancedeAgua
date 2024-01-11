import {Entity, model, property, hasMany} from '@loopback/repository';
import {Equipo} from './equipo.model';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'TipoFuncion'}}})
export class TipoFuncion extends Entity {
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
    type: 'string',
    required: true,
    length: 150,
    generated: 0,
    mssql: {columnName: 'nombre', dataType: 'nvarchar', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'NO', generated: 0},
  })
  nombre: string;

  @property({
    type: 'boolean',
    required: true,
    generated: 0,
    mssql: {columnName: 'estado', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: 0},
  })
  estado: boolean;

  @hasMany(() => Equipo)
  tipoFuncionsFk: Equipo[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<TipoFuncion>) {
    super(data);
  }
}

export interface TipoFuncionRelations {
  // describe navigational properties here
}

export type TipoFuncionWithRelations = TipoFuncion & TipoFuncionRelations;
