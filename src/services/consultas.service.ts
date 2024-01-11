 import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ConsultaConsumo, ConsultaPlantas, EquipoRelacionado, EquiposLocacion, Lecturas, Locacion, LocacionRelacionada} from '../Core/Interfaces/Datos.interface';
import {askDBO} from '../Core/Libraries/askDBO.library';
import {EquipoRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class ConsultasService {
  constructor(
    @repository(EquipoRepository)
    private equipoRepository: EquipoRepository
  ) { }

  async ObtenerDatos(data: ConsultaConsumo, Equipo: EquiposLocacion) {
    let datos: Array<Lecturas> = [];
    datos = await this.equipoRepository.dataSource.execute(
      `SET NOCOUNT ON
      DECLARE @StartDate DateTime
      DECLARE @EndDate DateTime
      SET @StartDate = '${data.fechaInicial}'
      SET @EndDate = '${data.fechaFinal}'
      SET NOCOUNT OFF
      SELECT temp.TagName 'tag_name',DateTime 'date',Value 'value',Unit = ISNULL(Cast(EngineeringUnit.Unit as VarChar(20)),'N/A') From (
      SELECT  *
       FROM Runtime.dbo.History
       WHERE History.TagName IN('${Equipo.tagName}')
       AND wwRetrievalMode = 'Cyclic'
       AND wwResolution = 900000
       AND wwQualityRule = 'Extended'
       AND wwVersion = 'Latest'
       AND DateTime >= @StartDate
       AND DateTime <= @EndDate) temp
      LEFT JOIN Runtime.dbo.AnalogTag ON AnalogTag.TagName =temp.TagName
      LEFT JOIN Runtime.dbo.EngineeringUnit ON AnalogTag.EUKey = EngineeringUnit.EUKey
       WHERE (DateTime = @StartDate or DateTime = @EndDate)
      `,
    );

    return await datos;
  }

  async ObtenerEquiposPorPlanta() {
    let datos: Array<EquiposLocacion> = await this.equipoRepository.dataSource.execute(
      `${askDBO.GET_EQUIPOS_LOCACION} e.locacionId = l.id and e.estado = 1 ORDER BY tagName ASC `,
    );

    return await datos;

  }

  async ObternerLocaciones(tipoLocacionId: number) {
    let datos: Array<Locacion> = await this.equipoRepository.dataSource.execute(
      `${askDBO.GET_LOCACION} estado = 1`,
    );

    return await datos;
  }

  async ObtenerDatosEnCliclos(fecha: Date, Equipo: EquiposLocacion, ciclos: number, tiempoCiclo: number) {

    let datos: Array<Lecturas> = [];
    datos = await this.equipoRepository.dataSource.execute(
      `
      SET NOCOUNT ON
      DECLARE @StartDate DateTime
      SET @StartDate = DATEADD(MINUTE,  ${ciclos * tiempoCiclo},'${(fecha).toISOString()}')
      SET NOCOUNT OFF
      SELECT temp.TagName 'tag_name',DateTime 'date',Value 'value',Unit = ISNULL(Cast(EngineeringUnit.Unit as VarChar(20)),'N/A') From (
      SELECT  *
      FROM Runtime.dbo.History
      WHERE History.TagName IN('${Equipo.tagName}')
      AND wwRetrievalMode = 'Cyclic'
      AND wwResolution = 900000
      AND wwQualityRule = 'Extended'
      AND wwVersion = 'Latest'
      AND DateTime >= @StartDate) temp
      LEFT JOIN Runtime.dbo.AnalogTag ON AnalogTag.TagName =temp.TagName
      LEFT JOIN Runtime.dbo.EngineeringUnit ON AnalogTag.EUKey = EngineeringUnit.EUKey
      WHERE (DateTime = @StartDate) and value IS NOT NULL

      `,
    );

    return await datos;
  }

  async ObtenerLecturaPromedio(data: ConsultaConsumo, Equipo: EquiposLocacion) {
    let datos: Array<Lecturas> = [];
    datos = await this.equipoRepository.dataSource.execute(
      `SET NOCOUNT ON
      DECLARE @StartDate DateTime
      DECLARE @EndDate DateTime
      SET @StartDate = '${data.fechaInicial}'
      SET @EndDate = '${data.fechaFinal}'
      SET NOCOUNT OFF
      SELECT value = AVG(ALL t.value) FROM (
      SELECT temp.TagName 'tag_name',DateTime 'date',Value 'value',Unit = ISNULL(Cast(EngineeringUnit.Unit as VarChar(20)),'N/A') From (
      SELECT  *
       FROM Runtime.dbo.History
       WHERE History.TagName IN('${Equipo.tagName}')
       AND wwRetrievalMode = 'Cyclic'
       AND wwResolution = 900000
       AND wwQualityRule = 'Extended'
       AND wwVersion = 'Latest'
       AND DateTime >= @StartDate
       AND DateTime <= @EndDate) temp
      LEFT JOIN Runtime.dbo.AnalogTag ON AnalogTag.TagName =temp.TagName
      LEFT JOIN Runtime.dbo.EngineeringUnit ON AnalogTag.EUKey = EngineeringUnit.EUKey
       WHERE (DateTime BETWEEN @StartDate AND @EndDate) AND Value IS NOT NULL
       ) AS t
      `,
    );

    return await datos;
  }

  async ObtenerLecturaPonderada(fecha: Date, equipo: Lecturas): Promise<Lecturas> {
    let datos: Lecturas = equipo;
    let data = await this.equipoRepository.dataSource.execute(
      `
      SET NOCOUNT ON
      DECLARE @endValue INT
      DECLARE @startValue INT
      DECLARE @tempValue INT
      DECLARE @Diference INT
      DECLARE @startTempDate DateTime
      DECLARE @endTempDate DateTime
      DECLARE @StartDate DateTime SET @StartDate = '${(fecha).toISOString()}'
      DECLARE @EndDate1 DateTime SET @EndDate1 = DATEADD(DAY, -15, @StartDate)
      DECLARE @EndDate2 DateTime SET @EndDate2 = DATEADD(DAY, 15, @StartDate)
      DECLARE @TAG NVARCHAR(50) SET @TAG = '${equipo.tag_name}'
      SET NOCOUNT OFF

      SELECT TOP 1 @startTempDate = t.date, @startValue = t.value FROM (SELECT temp.TagName 'tag_name',DateTime 'date', Value 'value',Unit = ISNULL(Cast(EngineeringUnit.Unit as VarChar(20)),'N/A') From (
      SELECT *
       FROM  Runtime.dbo.History
       WHERE History.TagName IN(@TAG)
       AND wwRetrievalMode = 'Cyclic'
       AND wwResolution = 900000
       AND wwQualityRule = 'Extended'
       AND wwVersion = 'Latest'
       AND DateTime <= @StartDate
       AND DateTime >= @EndDate1) temp
      LEFT JOIN  Runtime.dbo.AnalogTag ON AnalogTag.TagName =temp.TagName
      LEFT JOIN  Runtime.dbo.EngineeringUnit ON AnalogTag.EUKey = EngineeringUnit.EUKey
      WHERE  Value IS NOT NULL ) AS t ORDER BY t.date DESC

      SELECT TOP 1 @endTempDate = t.date, @endValue = t.value FROM (SELECT temp.TagName 'tag_name',DateTime 'date', Value 'value',Unit = ISNULL(Cast(EngineeringUnit.Unit as VarChar(20)),'N/A') From (
      SELECT *
       FROM  Runtime.dbo.History
       WHERE History.TagName IN(@TAG)
       AND wwRetrievalMode = 'Cyclic'
       AND wwResolution = 900000
       AND wwQualityRule = 'Extended'
       AND wwVersion = 'Latest'
       AND DateTime > @StartDate
       AND DateTime < @EndDate2) temp
      LEFT JOIN  Runtime.dbo.AnalogTag ON AnalogTag.TagName =temp.TagName
      LEFT JOIN  Runtime.dbo.EngineeringUnit ON AnalogTag.EUKey = EngineeringUnit.EUKey
       WHERE (Value IS NOT NULL)) AS t
       SELECT @Diference = (@endValue - @startValue) / (DATEDIFF(MINUTE, @startTempDate,  @endTempDate)/15)
       SELECT @tempValue = ((DATEDIFF(MINUTE, @startTempDate,  @StartDate)/15) * @Diference) + @startValue
       SELECT @tempValue value
      `,
    );
    datos.value = data[0].value;
    return await datos;
  }

  async ObtenerLocacionesRelacionadas() {
    let datos: Array<LocacionRelacionada> = [];
    datos = await this.equipoRepository.dataSource.execute(
      `${askDBO.GET_LOCACIONES_RELACIONADAS}`,
    );

    return await datos;
  }
  async ObtenerEquiposRelacionados() {
    let datos: Array<EquipoRelacionado> = [];
    datos = await this.equipoRepository.dataSource.execute(
      `${askDBO.GET_EQUIPOS_RELACIONADAS}`,
    );

    return await datos;
  }

}
