import { Module } from '@nestjs/common';
import { ClientesTurnosFijosService } from './clientes-turnos-fijos.service';

@Module({
  providers: [ClientesTurnosFijosService],
})
export class ClientesTurnosFijosModule {}
