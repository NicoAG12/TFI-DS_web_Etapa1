import { Module } from '@nestjs/common';
import { SagasModule } from './sagas/sagas.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [SagasModule, EventsModule],
})
export class AppModule {}
