import { Module } from '@nestjs/common';
import { TorneosEventsService } from './torneos-events.service';

@Module({
  providers: [TorneosEventsService],
  exports: [TorneosEventsService],
})
export class EventsModule {}
