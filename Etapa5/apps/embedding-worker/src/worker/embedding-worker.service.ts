import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmbeddingWorkerService {
  private readonly logger = new Logger(EmbeddingWorkerService.name);

  start() {
    this.logger.log('Embedding worker iniciado');
    this.logger.log('Escucha eventos: turno.*, matchmaking.*, torneo.*');
    this.logger.log('Genera embeddings y actualiza la base vectorial');
  }
}

