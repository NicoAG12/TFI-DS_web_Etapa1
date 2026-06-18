import { Module } from '@nestjs/common';
import { TorneosModule } from './torneos/torneos.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [TorneosModule, EventsModule],
})
export class AppModule {}
