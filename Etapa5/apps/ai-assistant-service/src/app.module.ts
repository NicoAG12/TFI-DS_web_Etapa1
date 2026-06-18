import { Module } from '@nestjs/common';
import { AssistantController } from './assistant/assistant.controller';
import { AssistantService } from './assistant/assistant.service';

@Module({
  controllers: [AssistantController],
  providers: [AssistantService],
})
export class AppModule {}

