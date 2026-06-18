import { Module } from '@nestjs/common';
import { ProyeccionEventsService } from './proyeccion-events.service';

@Module({
  providers: [ProyeccionEventsService],
})
export class EventosModule {}
