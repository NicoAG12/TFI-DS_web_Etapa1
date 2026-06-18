import { Module } from '@nestjs/common';
import { MatchmakingEventsService } from './matchmaking-events.service';

@Module({
  providers: [MatchmakingEventsService],
  exports: [MatchmakingEventsService],
})
export class EventsModule {}
