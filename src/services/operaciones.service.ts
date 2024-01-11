import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {EquiposLocacion, Lecturas} from '../Core/Interfaces/Datos.interface';

@injectable({scope: BindingScope.TRANSIENT})
export class OperacionesService {
  constructor(/* Add @inject to inject parameters */) { }

  async FormulaCiclicaLecturaTemporal(direccion: boolean, lecturaInicial: Lecturas, LecturaFinal: Lecturas, fechaB: Date, cantidadCiclos: number, equipo: EquiposLocacion) {

    let posicionBuscada: number = await this.PosicionBuscada(direccion, lecturaInicial, LecturaFinal, fechaB);
    cantidadCiclos = direccion ? cantidadCiclos += 1 : cantidadCiclos += 2;

    let lecturaTemporal: Lecturas = {
      id: equipo.id,
      date: fechaB,
      tag_name: equipo.tagName,
      value: (((LecturaFinal.value - lecturaInicial.value) / cantidadCiclos) * (posicionBuscada)) + lecturaInicial.value
    };

    return lecturaTemporal;
  }

  async PosicionBuscada(direccion: boolean, lecturaInicial: Lecturas, LecturaFinal: Lecturas, fechaB: Date) {
    let posicionBuscada = 0;

    if (lecturaInicial && LecturaFinal) {
      let fechaBuscada = new Date(Date.parse((fechaB).toString())).toISOString();
      let fechaEncontrada = new Date(Date.parse((lecturaInicial.date).toString()) + (900000)).toISOString();
      posicionBuscada = ((Date.parse(fechaBuscada)) - (Date.parse(fechaEncontrada))) / 900000;
    }

    posicionBuscada += 1;

    return posicionBuscada;

  }
}
