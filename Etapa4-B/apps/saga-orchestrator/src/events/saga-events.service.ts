import { Injectable } from '@nestjs/common';

@Injectable()
export class SagaEventsService {
  publishSagaIniciada(sagaId: string, tipo: string) {
    return `Evento publicado: saga.iniciada { id: ${sagaId}, tipo: ${tipo} }`;
  }

  publishSagaCompletada(sagaId: string) {
    return `Evento publicado: saga.completada { id: ${sagaId} }`;
  }

  publishSagaFallida(sagaId: string, paso: number, motivo: string) {
    return `Evento publicado: saga.fallida { id: ${sagaId}, paso: ${paso}, motivo: ${motivo} }`;
  }

  publishSagaCompensada(sagaId: string) {
    return `Evento publicado: saga.compensada { id: ${sagaId} }`;
  }
}
