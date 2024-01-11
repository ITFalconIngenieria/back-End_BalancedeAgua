import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {ConsultaConsumo, DatosEquipo, EquipoRelacionado, esquemaDatos, Lecturas, LocacionRelacionada} from '../Core/Interfaces/Datos.interface';
import {ConsultasService} from './consultas.service';

@injectable({scope: BindingScope.TRANSIENT})
export class EsquemasService {
  constructor(
    @service(ConsultasService)
    private consultasService: ConsultasService
  ) { }

  async ConsumoPorTipoLocacion(consulta: ConsultaConsumo, Lectura: Lecturas[]) {
    let Equipos = await this.consultasService.ObtenerEquiposPorPlanta();
    let Plantas = await this.consultasService.ObternerLocaciones(1);
    let LocacionesRelacionadas = await this.consultasService.ObtenerLocacionesRelacionadas();
    let EquiposRelacionados = await this.consultasService.ObtenerEquiposRelacionados();
    let estaRegistrado: boolean = false;
    let EsquemaConsumos: esquemaDatos[] = [];

    for (let i = 0; i < Plantas.length; i++) {
      EsquemaConsumos.push(
        {
          locacion: {
            id: Plantas[i].id,
            descripcion: Plantas[i].descripcion,
            observacion: Plantas[i].observacion,
            tipoLocacionId: Plantas[i].tipoLocacionId,
            estado: true
          },
          equipos: {
            datos: [],
            expands: false,
            expands2: false,
            expands3: false
          },
          relaciones: [],
          locacionesRelacionadas: [],
          calidadagua: {
            conductividadPromedio: 0,
            potencialhidrogenoPromedio: 0,
            potencialreduccionPromedio: 0,
            presionPromedio: 0,
            contConductividad: 0,
            contPH: 0,
            contPR: 0,
            contPresion: 0
          },
          consumototal: 0,
          producciontotal: 0,
          reposiciontotal: 0,
          consumocalientetotal: 0,
        }
      );
    }

    for (let i = 0; i < Lectura.length; i += 2) {
      for (let j = 0; j < Equipos.length; j++) {

        if (Equipos[j].tagName == Lectura[i].tag_name) {

          for (let k = 0; k < EsquemaConsumos.length; k++) {
            if (Equipos[j].locacionId == EsquemaConsumos[k].locacion.id) {

              for (let l = 0; l < EsquemaConsumos.length; l++) {
                for (let m = 0; m < EsquemaConsumos[l].equipos.datos.length; m++) {
                  if (EsquemaConsumos[l].equipos.datos[m].tag_name == Equipos[j].tagName) {
                    estaRegistrado = true
                  }

                }
              }

              if (!estaRegistrado) {
                if (Equipos[j].tipoFuncionId <= 4) {
                  EsquemaConsumos[k].equipos.datos.push({
                    id: Equipos[j].id,
                    tag_name: Lectura[i].tag_name,
                    descripcion: Equipos[j].descEquipo,
                    tipoFuncionId: Equipos[j].tipoFuncionId,
                    fechaInicial: consulta.fechaInicial,
                    fechaFinal: consulta.fechaFinal,
                    lecturaInicial: Lectura[i].value,
                    lecturaFinal: Lectura[i + 1].value,
                    consumo: Lectura[i + 1].value - Lectura[i].value
                  }
                  );

                } else if (Equipos[j].tipoFuncionId > 4) {
                  EsquemaConsumos[k].equipos.datos.push({
                    id: Equipos[j].id,
                    tag_name: Lectura[i].tag_name,
                    descripcion: Equipos[j].descEquipo,
                    tipoFuncionId: Equipos[j].tipoFuncionId,
                    fechaInicial: consulta.fechaInicial,
                    fechaFinal: consulta.fechaFinal,
                    lecturaInicial: Lectura[i].value,
                    lecturaFinal: Lectura[i + 1].value,
                    consumo: Lectura[i].value
                  }
                  );
                }
              } else {
                estaRegistrado = false;
              }
            }
          }
        }
      }
    }

    EsquemaConsumos = await this.identificarEquipoRelacionado(EquiposRelacionados, EsquemaConsumos);

    for (let i = 0; i < EsquemaConsumos.length; i++) {
      for (let j = 0; j < EsquemaConsumos[i].relaciones.length; j++) {
        let RelacionIdentificada: DatosEquipo | undefined = await this.IdentificarEquipo(EsquemaConsumos[i].relaciones[j], EsquemaConsumos);
        if (RelacionIdentificada) {
          EsquemaConsumos[i].equipos.datos.push(RelacionIdentificada);
        }
      }
    }

    EsquemaConsumos = await this.CalidadDeAgua(EsquemaConsumos);
    EsquemaConsumos = await this.CalidadDeAguaPromedio(EsquemaConsumos);
    EsquemaConsumos = await this.identificarLocacionPrincipal(LocacionesRelacionadas, EsquemaConsumos);

    return EsquemaConsumos;
  }

  async IdentificarEquipo(relacion: EquipoRelacionado, esquemaDatos: esquemaDatos[]) {
    for (let i = 0; i < esquemaDatos.length; i++) {
      for (let j = 0; j < esquemaDatos[i].equipos.datos.length; j++) {
        if (esquemaDatos[i].equipos.datos[j].id === relacion.equipoId) {
          return esquemaDatos[i].equipos.datos[j];
        }
      }
    }
  }


  async CalidadDeAgua(EsquemaConsumos: esquemaDatos[]) {
    for (let i = 0; i < EsquemaConsumos.length; i++) {
      for (let j = 0; j < EsquemaConsumos[i].equipos.datos.length; j++) {
        const equipo = EsquemaConsumos[i].equipos.datos[j];

        if(equipo.tipoFuncionId === 1){
          EsquemaConsumos[i].consumototal += equipo.consumo;
        }else if(equipo.tipoFuncionId === 2 && equipo.tag_name === 'R3_WTR_FT1.TOT'){
          EsquemaConsumos[i].consumototal += equipo.lecturaFinal - equipo.lecturaInicial;
        }
        else{
          EsquemaConsumos[i].reposiciontotal = EsquemaConsumos[i].equipos.datos[j].tipoFuncionId == 2 ?
            EsquemaConsumos[i].reposiciontotal += EsquemaConsumos[i].equipos.datos[j].consumo :
            EsquemaConsumos[i].reposiciontotal;
  
          EsquemaConsumos[i].producciontotal = EsquemaConsumos[i].equipos.datos[j].tipoFuncionId == 3 ?
            EsquemaConsumos[i].producciontotal += EsquemaConsumos[i].equipos.datos[j].consumo :
            EsquemaConsumos[i].producciontotal;
  
          EsquemaConsumos[i].consumocalientetotal = EsquemaConsumos[i].equipos.datos[j].tipoFuncionId == 4 ?
            EsquemaConsumos[i].consumocalientetotal += EsquemaConsumos[i].equipos.datos[j].consumo :
            EsquemaConsumos[i].consumocalientetotal;
  
          if (EsquemaConsumos[i].equipos.datos[j].tipoFuncionId == 5) {
            EsquemaConsumos[i].calidadagua.conductividadPromedio += EsquemaConsumos[i].equipos.datos[j].consumo;
            EsquemaConsumos[i].equipos.datos[j].consumo > 0 ? EsquemaConsumos[i].calidadagua.contConductividad++
              : EsquemaConsumos[i].calidadagua.contConductividad = EsquemaConsumos[i].calidadagua.contConductividad;
          }
          if (EsquemaConsumos[i].equipos.datos[j].tipoFuncionId == 6) {
            EsquemaConsumos[i].calidadagua.potencialreduccionPromedio += EsquemaConsumos[i].equipos.datos[j].consumo;
            EsquemaConsumos[i].equipos.datos[j].consumo < 0 || EsquemaConsumos[i].equipos.datos[j].consumo > 0 ? EsquemaConsumos[i].calidadagua.contPR++
              : EsquemaConsumos[i].calidadagua.contPR = EsquemaConsumos[i].calidadagua.contPR;
          }
          if (EsquemaConsumos[i].equipos.datos[j].tipoFuncionId == 7) {
            EsquemaConsumos[i].calidadagua.potencialhidrogenoPromedio += EsquemaConsumos[i].equipos.datos[j].consumo;
            EsquemaConsumos[i].equipos.datos[j].consumo > 0 ? EsquemaConsumos[i].calidadagua.contPH++
              : EsquemaConsumos[i].calidadagua.contPH = EsquemaConsumos[i].calidadagua.contPH;
          }
          if (EsquemaConsumos[i].equipos.datos[j].tipoFuncionId == 8) {
            EsquemaConsumos[i].calidadagua.presionPromedio += EsquemaConsumos[i].equipos.datos[j].consumo;
            EsquemaConsumos[i].equipos.datos[j].consumo > 0 ? EsquemaConsumos[i].calidadagua.contPresion++
              : EsquemaConsumos[i].calidadagua.contPresion = EsquemaConsumos[i].calidadagua.contPresion;
          }
        }

      }
    }
    return EsquemaConsumos;
  }

  CalidadDeAguaPromedio(EsquemaConsumos: esquemaDatos[]) {
    for (let i = 0; i < EsquemaConsumos.length; i++) {
      // console.log(EsquemaConsumos[i].calidadagua.conductividadPromedio);
      // console.log(EsquemaConsumos[i].calidadagua.conductividadPromedio);

      EsquemaConsumos[i].calidadagua.contConductividad > 0 ? EsquemaConsumos[i].calidadagua.conductividadPromedio /= EsquemaConsumos[i].calidadagua.contConductividad : EsquemaConsumos[i].calidadagua.conductividadPromedio /= 1;
      EsquemaConsumos[i].calidadagua.contPH > 0 ? EsquemaConsumos[i].calidadagua.potencialhidrogenoPromedio /= EsquemaConsumos[i].calidadagua.contPH : EsquemaConsumos[i].calidadagua.potencialhidrogenoPromedio /= 1;
      EsquemaConsumos[i].calidadagua.contPR > 0 ? EsquemaConsumos[i].calidadagua.potencialreduccionPromedio /= EsquemaConsumos[i].calidadagua.contPR : EsquemaConsumos[i].calidadagua.potencialreduccionPromedio /= 1;
      EsquemaConsumos[i].calidadagua.contPresion > 0 ? EsquemaConsumos[i].calidadagua.presionPromedio /= EsquemaConsumos[i].calidadagua.contPresion : EsquemaConsumos[i].calidadagua.presionPromedio /= 1;
    }
    return EsquemaConsumos;
  }

  async identificarEquipoRelacionado(relaciones: EquipoRelacionado[], EsquemaConsumos: esquemaDatos[]) {
    for (let i = 0; i < EsquemaConsumos.length; i++) {
      for (let j = 0; j < relaciones.length; j++) {
        if (relaciones[j].locacionId == EsquemaConsumos[i].locacion.id) {
          EsquemaConsumos[i].relaciones.push(relaciones[j]);
        }
      }
    }
    return EsquemaConsumos;
  }

  async identificarLocacionPrincipal(locaciones: LocacionRelacionada[], EsquemaConsumos: esquemaDatos[]) {
    for (let i = 0; i < EsquemaConsumos.length; i++) {
      for (let j = 0; j < locaciones.length; j++) {
        if (locaciones[j].locacionPrincipalId == EsquemaConsumos[i].locacion.id) {
          let LocacionSecundariaIdentificada: esquemaDatos | undefined = await this.identificarLocacionSecundaria(locaciones[j], EsquemaConsumos);
          if (LocacionSecundariaIdentificada) {
            EsquemaConsumos[i].locacionesRelacionadas.push(LocacionSecundariaIdentificada);
          }
        }
      }
    }
    return EsquemaConsumos;
  }
  async identificarLocacionSecundaria(locaciones: LocacionRelacionada, EsquemaConsumos: esquemaDatos[]) {
    for (let i = 0; i < EsquemaConsumos.length; i++) {
      if (locaciones.locacionSecundId == EsquemaConsumos[i].locacion.id) {
        return EsquemaConsumos[i];
      }
    }

  }
}


