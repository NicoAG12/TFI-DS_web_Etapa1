import { Module } from '@nestjs/common';
import { TorneosService } from './torneos.service';
import { TorneosController } from './torneos.controller';

@Module({
  controllers: [TorneosController],
  providers: [TorneosService],
})
export class TorneosModule {}
