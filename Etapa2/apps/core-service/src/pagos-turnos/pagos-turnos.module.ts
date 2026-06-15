import { Module } from '@nestjs/common';
import { PagosTurnosService } from './pagos-turnos.service';
import { PagosTurnosController } from './pagos-turnos.controller';

@Module({
  controllers: [PagosTurnosController],
  providers: [PagosTurnosService],
})
export class PagosTurnosModule {}
