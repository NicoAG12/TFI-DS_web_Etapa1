import { Module } from '@nestjs/common';
import { EsperaService } from './esperas.service';
import { EsperaController } from './esperas.controller';

@Module({
  controllers: [EsperaController],
  providers: [EsperaService],
})
export class EsperaModule {}
