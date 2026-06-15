import { Module } from '@nestjs/common';
import { SagaEventsService } from './saga-events.service';

@Module({
  providers: [SagaEventsService],
  exports: [SagaEventsService],
})
export class EventsModule {}
