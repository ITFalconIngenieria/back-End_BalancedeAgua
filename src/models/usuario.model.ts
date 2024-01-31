import {Entity, model, property} from '@loopback/repository';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'usuario'}}})
export class Usuario extends Entity {
  @property({
    type: 'number',
    precision: 10,
    scale: 0,
    id: true,  
    mssql: {columnName: 'id', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'NO'},
  })
  id?: number;
  
  

  @property({
    type: 'string',
    length: 150,
    mssql: {columnName: 'Nombre', dataType: 'varchar', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  nombre?: string;

  @property({
    type: 'string',
    length: 150,
    mssql: {columnName: 'Apellido', dataType: 'varchar', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  apellido?: string;

  @property({
    type: 'string',
    length: 150,
    mssql: {columnName: 'Telefono', dataType: 'varchar', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  telefono?: string;

  @property({
    type: 'string',
    length: 150,
    mssql: {columnName: 'Correo', dataType: 'varchar', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  correo: string;

  @property({
    type: 'number',
    precision: 10,
    scale: 0,
    mssql: {columnName: 'IdCredenciales', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'YES'},
  })
  tipoUsuario?: number;

  @property({
    type: 'boolean',
    mssql: {columnName: 'Estado', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  estado?: boolean;

  constructor(data?: Partial<Usuario>) {
    super(data);
  }

  getId() {
    return this.id
  }
}

export interface UsuarioRelations {
  // describe navigational properties here
}

export type UsuarioWithRelations = Usuario & UsuarioRelations;
