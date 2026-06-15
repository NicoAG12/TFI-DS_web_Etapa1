import { Injectable } from '@nestjs/common';

@Injectable()
export class TorneosEventsService {
  publishTorneoCreado(torneoId: number) {
    return `Evento publicado: torneo.creado { id: ${torneoId} }`;
  }

  publishTorneoCancelado(torneoId: number) {
    return `Evento publicado: torneo.cancelado { id: ${torneoId} }`;
  }

  publishTorneoFinalizado(torneoId: number) {
    return `Evento publicado: torneo.finalizado { id: ${torneoId} }`;
  }

  publishInscripcionRealizada(torneoId: number, usuarioId: number) {
    return `Evento publicado: torneo.inscripcion { torneoId: ${torneoId}, usuarioId: ${usuarioId} }`;
  }
}
