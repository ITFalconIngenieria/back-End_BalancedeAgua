import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {ConsultaConsumo, EquiposLocacion, Lecturas} from '../Core/Interfaces/Datos.interface';
import {ConsultasService} from './consultas.service';
import {OperacionesService} from './operaciones.service';

@injectable({scope: BindingScope.TRANSIENT})
export class AlgoritmosService {
  constructor(
    @service(ConsultasService)
    private consultasService: ConsultasService,
    @service(OperacionesService)
    private operacionesService: OperacionesService,
  ) { }

  async lecturaTemporal(consulta: ConsultaConsumo) {
    let equipos: Array<EquiposLocacion> = await this.consultasService.ObtenerEquiposPorPlanta();
    let Lectura: Lecturas[] = [];
    let Lecturas: Lecturas[] = [];
    let LecturaTemporalInicial: Array<Lecturas> = [], LecturaTemporalFinal: Array<Lecturas> = [];
    let cantidadCiclos = 0;
    let fechaInicial = new Date(Date.parse(consulta.fechaInicial) - (3600000 * 6));
    for (let i = 0; i < equipos.length; i++) {
      if (equipos[i].tipoFuncionId <= 4) {
        Lectura = await this.consultasService.ObtenerDatos(consulta, equipos[i]);

        if (Lectura.length > 1) {
          for (let j = 0; j < Lectura.length; j++) {
            let LecturaReemplazo!: Lecturas;

            if (!Lectura[j].value) {
              LecturaReemplazo = (await this.consultasService.ObtenerLecturaPonderada(Lectura[j].date, Lectura[j]));
              // console.log(LecturaReemplazo);

              if (LecturaReemplazo.value) {
                Lectura[j].value = LecturaReemplazo.value;
              }
            }

            Lecturas.push(
              Lectura[j]
            );

          }
        }
      }

      if (equipos[i].tipoFuncionId > 4 && equipos[i].tipoFuncionId <= 8) {
        Lectura = await this.consultasService.ObtenerLecturaPromedio(consulta, equipos[i]);
        Lecturas.push(
          {
            id: equipos[i].id,
            tag_name: equipos[i].tagName,
            date: new Date(consulta.fechaInicial),
            value: Lectura[0].value
          }
        );
        Lecturas.push(
          {
            id: equipos[i].id,
            tag_name: equipos[i].tagName,
            date: new Date(consulta.fechaFinal),
            value: Lectura[0].value
          }
        );
      }
    }

    return Lecturas;
  }
  async IdentiLecturaFaltante(fechaInicial: Date, fechaFaltante: Date) {

    if (Date.parse((fechaInicial).toString()) == Date.parse((fechaFaltante).toString())) {
      return true;
    }
    return false;
  }
}
