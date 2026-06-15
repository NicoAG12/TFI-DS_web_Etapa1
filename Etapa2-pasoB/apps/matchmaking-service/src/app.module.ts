import { Module } from '@nestjs/common';
import { EsperasModule } from './esperas/esperas.module';
import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [EsperasModule, MatchmakingModule, NotificacionesModule, EventsModule],
})
export class AppModule {}
