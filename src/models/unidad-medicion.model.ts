import {Entity, model, property, hasMany} from '@loopback/repository';
import {Equipo} from './equipo.model';

@model({
  settings: {idInjection: false, mssql: {schema: 'dbo', table: 'UnidadMedicion'}}
})
export class UnidadMedicion extends Entity {
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
    length: 200,
    generated: 0,
    mssql: {columnName: 'nombre', dataType: 'nvarchar', dataLength: 200, dataPrecision: null, dataScale: null, nullable: 'NO', generated: 0},
  })
  nombre: string;

  @property({
    type: 'number',
    required: true,
    precision: 53,
    generated: 0,
    mssql: {columnName: 'multiplicador', dataType: 'float', dataLength: null, dataPrecision: 53, dataScale: null, nullable: 'NO', generated: 0},
  })
  multiplicador: number;

  @property({
    type: 'string',
    length: 300,
    generated: 0,
    mssql: {columnName: 'descripcion', dataType: 'nvarchar', dataLength: 300, dataPrecision: null, dataScale: null, nullable: 'YES', generated: 0},
  })
  descripcion?: string;

  @property({
    type: 'boolean',
    required: true,
    generated: 0,
    mssql: {columnName: 'estado', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: 0},
  })
  estado: boolean;

  @hasMany(() => Equipo, {keyTo: 'unidadId'})
  unidadMedicionFk: Equipo[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<UnidadMedicion>) {
    super(data);
  }
}

export interface UnidadMedicionRelations {
  // describe navigational properties here
}

export type UnidadMedicionWithRelations = UnidadMedicion & UnidadMedicionRelations;
