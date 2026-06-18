import { Injectable } from '@nestjs/common';

@Injectable()
export class MatchmakingEventsService {
  publishEsperaCreada(esperaId: number, turnoId: number) {
    return `Evento publicado: espera.creada { id: ${esperaId}, turnoId: ${turnoId} }`;
  }

  publishMatchmakingActivado(matchmakingId: number, esperaId: number) {
    return `Evento publicado: matchmaking.activado { id: ${matchmakingId}, esperaId: ${esperaId} }`;
  }

  publishMatchmakingAceptado(matchmakingId: number) {
    return `Evento publicado: matchmaking.aceptado { id: ${matchmakingId} }`;
  }

  publishMatchmakingRechazado(matchmakingId: number) {
    return `Evento publicado: matchmaking.rechazado { id: ${matchmakingId} }`;
  }

  publishMatchmakingExpirado(matchmakingId: number) {
    return `Evento publicado: matchmaking.expirado { id: ${matchmakingId} }`;
  }

  publishNotificacionEnviada(notificacionId: number, usuarioId: number) {
    return `Evento publicado: notificacion.enviada { id: ${notificacionId}, usuarioId: ${usuarioId} }`;
  }
}
