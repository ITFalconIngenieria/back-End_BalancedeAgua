import {Entity, model, property, hasMany} from '@loopback/repository';
import {Locacion} from './locacion.model';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'TipoLocacion'}}})
export class TipoLocacion extends Entity {
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
    length: 150,
    generated: 0,
    mssql: {columnName: 'nombre', dataType: 'nvarchar', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES', generated: 0},
  })
  nombre?: string;

  @property({
    type: 'boolean',
    generated: 0,
    mssql: {columnName: 'estado', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES', generated: 0},
  })
  estado?: boolean;

  @hasMany(() => Locacion)
  locationsFk: Locacion[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<TipoLocacion>) {
    super(data);
  }
}

export interface TipoLocacionRelations {
  // describe navigational properties here
}

export type TipoLocacionWithRelations = TipoLocacion & TipoLocacionRelations;
