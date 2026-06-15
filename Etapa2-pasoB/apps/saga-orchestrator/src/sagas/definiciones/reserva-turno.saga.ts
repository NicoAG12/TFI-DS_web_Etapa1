import { Injectable } from '@nestjs/common';

@Injectable()
export class ReservaTurnoSaga {
  pasos = [
    {
      orden: 1,
      nombre: 'reservarTurno',
      comando: 'core.reservarTurno',
      compensacion: 'core.liberarTurno',
    },
    {
      orden: 2,
      nombre: 'registrarPago',
      comando: 'core.registrarPago',
      compensacion: 'core.anularPago',
    },
    {
      orden: 3,
      nombre: 'notificarCliente',
      comando: 'notificaciones.enviar',
      compensacion: null,
    },
  ];
}
