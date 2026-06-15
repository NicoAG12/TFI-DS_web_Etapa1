import { Module } from '@nestjs/common';
import { EsperasModule } from './esperas/esperas.module';
import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { CircuitBreakerModule } from './circuit-breaker/circuit-breaker.module';

@Module({
  imports: [EsperasModule, MatchmakingModule, NotificacionesModule, CircuitBreakerModule],
})
export class AppModule {}
