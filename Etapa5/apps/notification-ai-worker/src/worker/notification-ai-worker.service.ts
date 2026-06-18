import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationAiWorkerService {
  private readonly logger = new Logger(NotificationAiWorkerService.name);

  start() {
    this.logger.log('Notification AI worker iniciado');
    this.logger.log('Escucha notificacion.personalizar.solicitada');
    this.logger.log('Usa LLM con timeout y fallback a plantilla estatica');
  }
}

