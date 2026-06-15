import { Module } from '@nestjs/common';
import { PagosTurnoService } from './pagos-turnos.service';
import { PagosTurnoController } from './pagos-turnos.controller';

@Module({
  controllers: [PagosTurnoController],
  providers: [PagosTurnoService],
})
export class PagosTurnoModule {}
