import { Module } from '@nestjs/common';
import { NotificationAiWorkerService } from './worker/notification-ai-worker.service';

@Module({
  providers: [NotificationAiWorkerService],
})
export class AppModule {}

