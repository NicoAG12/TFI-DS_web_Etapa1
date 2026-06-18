import { Module } from '@nestjs/common';
import { EmbeddingWorkerService } from './worker/embedding-worker.service';

@Module({
  providers: [EmbeddingWorkerService],
})
export class AppModule {}

