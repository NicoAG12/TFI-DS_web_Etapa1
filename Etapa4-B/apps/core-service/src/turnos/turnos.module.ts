import { Module } from '@nestjs/common';
import { TurnoService } from './turnos.service';
import { TurnoController } from './turnos.controller';

@Module({
  controllers: [TurnoController],
  providers: [TurnoService],
})
export class TurnoModule {}
