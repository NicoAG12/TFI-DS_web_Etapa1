import { Module } from '@nestjs/common';
import { EsperasService } from './esperas.service';
import { EsperasController } from './esperas.controller';

@Module({
  controllers: [EsperasController],
  providers: [EsperasService],
})
export class EsperasModule {}
