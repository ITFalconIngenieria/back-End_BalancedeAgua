import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {ConsultaConsumo, ConsultaEquipos, ConsultaPlantas, LecturasEquipos, esquemaDatos} from '../Core/Interfaces/Datos.interface';
import {AlgoritmosService} from './algoritmos.service';
import {EsquemasService} from './esquemas.service';
import { repository } from '@loopback/repository';
import { EquipoRepository } from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class ConsumoService {
  constructor(
    @service(AlgoritmosService)
    private algoritmosService: AlgoritmosService,
    @service(EsquemasService)
    private esquemasService: EsquemasService,
    @repository(EquipoRepository) // Agrega esto para inyectar el repositorio
    private equipoRepository: EquipoRepository,
  ) { }
  
    
  async CalculoConsumo(data: ConsultaConsumo) {
    let esquemaDatos: Array<esquemaDatos> = [];

    let Lecturas = await this.algoritmosService.lecturaTemporal(data);
    esquemaDatos = await this.esquemasService.ConsumoPorTipoLocacion(data, Lecturas);

    return esquemaDatos;
  }

  async ObtenerPlantas():Promise<ConsultaPlantas[]> {
    try {
      let datos: Array<ConsultaPlantas> = await this.equipoRepository.dataSource.execute(
        `SELECT Top 6 l.id, l.descripcion
        FROM BalanceAgua.dbo.Locacion l 
        WHERE estado = 1;`
      );
      return datos;
    } catch (error) {
      console.error('Error al obtener plantas:', error);
      throw new Error('Error al obtener plantas');
    }
  }

  async ObtenerEquipos(PlantaDescrip:string):Promise<ConsultaEquipos[]> {
    try {
      let datos: Array<ConsultaEquipos> = await this.equipoRepository.dataSource.execute(
        `SELECT e.id, e.descripcion , e.tagName
        FROM BalanceAgua.dbo.Equipo e, BalanceAgua.dbo.Locacion l 
        WHERE e.locacionId = l.id   and l.descripcion = '${PlantaDescrip}'  ORDER BY tagName ASC `
      );
      return datos;
    } catch (error) {
      console.error('Error al obtener plantas:', error);
      throw new Error('Error al obtener plantas');
    }
  }

  async LecturasXMedidor(f1:Date, f2:Date, tag:string):Promise<LecturasEquipos[]> {
    try {
      let datos: Array<LecturasEquipos> = await this.equipoRepository.dataSource.execute(
        ` -- Obtener datos
        WITH TagData AS (
          SELECT
              TagName,
              DateTime,
              Value,
              ROW_NUMBER() OVER (ORDER BY DateTime) AS RowNum,
              MAX(DateTime) OVER () AS MaxDateTime
          FROM
              Runtime.dbo.History
          WHERE
              History.TagName = '${tag}'
              AND wwRetrievalMode = 'Cyclic'
              AND wwResolution = 900000
              AND wwQualityRule = 'Extended'
              AND wwVersion = 'Latest'
              AND DateTime BETWEEN '${f1}' AND '${f2}'
      )
      
      -- Obtener valores de inicio y final
      SELECT
          StartData.TagName AS tag_name,
          StartData.Value AS valorInicio,
          EndData.Value AS valorFinal,
          EndData.Value - StartData.Value AS consumo
      FROM
          TagData StartData
      JOIN
          TagData EndData ON StartData.RowNum = 1 AND EndData.DateTime = StartData.MaxDateTime;
        `
      );
      return datos;
    } catch (error) {
      console.error('Error al obtener plantas:', error);
      throw new Error('Error al obtener plantas');
    }
  }


  async calidadAgua(data: ConsultaConsumo, esquemaDatos: esquemaDatos[]) {

    return esquemaDatos;
  }
}
