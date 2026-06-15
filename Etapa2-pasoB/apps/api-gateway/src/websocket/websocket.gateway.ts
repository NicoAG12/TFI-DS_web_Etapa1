import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/notificaciones' })
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  notificarTurnoCreado(turnoId: number, usuarioId: number) {
    this.server.emit('turno.creado', { turnoId, usuarioId, mensaje: 'Turno reservado exitosamente' });
  }

  notificarMatchmaking(matchmakingId: number, usuarioId: number, ventanaMinutos: number) {
    this.server.emit('matchmaking.oferta', {
      matchmakingId,
      usuarioId,
      mensaje: `Tenés ${ventanaMinutos} minutos para aceptar el turno`,
      ventanaMinutos,
    });
  }

  notificarSagaCompletada(sagaId: string) {
    this.server.emit('saga.completada', { sagaId, estado: 'COMPLETADA' });
  }

  notificarSagaFallida(sagaId: string, motivo: string) {
    this.server.emit('saga.fallida', { sagaId, estado: 'FALLIDA', motivo });
  }
}
