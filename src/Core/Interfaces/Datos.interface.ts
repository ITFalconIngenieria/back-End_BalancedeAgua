export interface Lecturas {
  id: number,
  tag_name: string,
  date: Date,
  value: number
}

export interface ConsultaPlantas{
  id:number;
  descripcion:string;
}

export interface ConsultaEquipos{
  id:number;
  descripcion:string;
  tag:string;
}

export interface LecturasEquipos{
  tag:string;
  valorInicio:number;
  valorFinal:number;
  consumo:number;
}

export interface ConsultaConsumo {
  fechaInicial: string,
  fechaFinal: string,
}

export interface Locacion {
  id: number,
  descripcion: string,
  observacion: string,
  tipoLocacionId: number,
  estado: boolean
}

export interface EquiposLocacion {
  id: number,
  locacionId: number,
  tipoEquipoId: number,
  tipoLocacionId: number,
  tipoFuncionId: number,
  tagName: string,
  descLoca: string,
  descEquipo: string,
}

export interface DatosEquipo {
  id: number,
  tag_name: string,
  descripcion: string,
  tipoFuncionId: number,
  fechaInicial: string,
  fechaFinal: string,
  lecturaInicial: number,
  lecturaFinal: number,
  consumo: number,
}
export interface EquipoRelacionado {
  id: number,
  equipoId: number,
  locacionId: number,
  estado: boolean,
}
export interface LocacionRelacionada {
  id: number,
  locacionPrincipalId: number,
  locacionSecundId: number,
  estado: boolean,
}

export interface CalidadAgua {
  conductividadPromedio: number,
  potencialreduccionPromedio: number,
  potencialhidrogenoPromedio: number,
  presionPromedio: number,
  contConductividad: number,
  contPH: number,
  contPR: number,
  contPresion: number;
}

export interface esquemaDatos {
  locacion: Locacion,
  equipos: {
    datos: DatosEquipo[],
    expands: boolean,
    expands2: boolean,
    expands3: boolean
  },
  relaciones: EquipoRelacionado[],
  locacionesRelacionadas: esquemaDatos[],
  calidadagua: CalidadAgua,
  consumototal: number,
  producciontotal: number,
  reposiciontotal: number,
  consumocalientetotal: number

}

export interface lecturaPonderada {
  value: number
}
