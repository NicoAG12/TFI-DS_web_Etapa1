import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NotificationAiWorkerService } from './worker/notification-ai-worker.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const worker = app.get(NotificationAiWorkerService);
  worker.start();
}

bootstrap();

