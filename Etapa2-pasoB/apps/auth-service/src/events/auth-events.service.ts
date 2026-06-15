import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthEventsService {
  publishUsuarioCreado(usuarioId: number) {
    return `Evento publicado: usuario.creado { id: ${usuarioId} }`;
  }

  publishUsuarioActualizado(usuarioId: number) {
    return `Evento publicado: usuario.actualizado { id: ${usuarioId} }`;
  }

  publishUsuarioEliminado(usuarioId: number) {
    return `Evento publicado: usuario.eliminado { id: ${usuarioId} }`;
  }
}
