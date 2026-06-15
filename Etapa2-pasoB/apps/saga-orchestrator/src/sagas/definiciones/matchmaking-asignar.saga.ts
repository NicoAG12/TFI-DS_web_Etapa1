import { Injectable } from '@nestjs/common';

@Injectable()
export class MatchmakingAsignarSaga {
  pasos = [
    {
      orden: 1,
      nombre: 'transferirTurno',
      comando: 'core.transferirTurno',
      compensacion: 'core.revertirTurno',
    },
    {
      orden: 2,
      nombre: 'marcarEsperaAceptada',
      comando: 'matchmaking.marcarEsperaAceptada',
      compensacion: 'matchmaking.devolverEspera',
    },
    {
      orden: 3,
      nombre: 'notificarGanador',
      comando: 'notificaciones.notificarGanador',
      compensacion: null,
    },
    {
      orden: 4,
      nombre: 'notificarPerdedor',
      comando: 'notificaciones.notificarPerdedor',
      compensacion: null,
    },
  ];
}
