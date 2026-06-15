import { Module } from '@nestjs/common';
import { VentasEventsService } from './ventas-events.service';

@Module({
  providers: [VentasEventsService],
  exports: [VentasEventsService],
})
export class EventsModule {}
