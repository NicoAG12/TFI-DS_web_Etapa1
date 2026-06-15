import { Injectable } from '@nestjs/common';

@Injectable()
export class ProyeccionesService {
  getTurnosDelDia(fecha: string) {
    return `This action returns turnos del dia ${fecha} (tabla plana: turnos_del_dia)`;
  }

  getEstadoCaja(cajaId: number) {
    return `This action returns estado de caja #${cajaId} (tabla plana: estado_caja)`;
  }

  getDashboard() {
    return `This action returns dashboard consolidado`;
  }
}
