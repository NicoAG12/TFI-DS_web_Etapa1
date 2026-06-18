import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EmbeddingWorkerService } from './worker/embedding-worker.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const worker = app.get(EmbeddingWorkerService);
  worker.start();
}

bootstrap();

