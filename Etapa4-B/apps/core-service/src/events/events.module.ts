import { Module } from '@nestjs/common';
import { CoreEventsService } from './core-events.service';

@Module({
  providers: [CoreEventsService],
  exports: [CoreEventsService],
})
export class EventsModule {}
