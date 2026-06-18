import { Module } from '@nestjs/common';
import { CanchasModule } from './canchas/canchas.module';
import { ClientesModule } from './clientes/clientes.module';
import { ClientesTurnosFijosModule } from './clientes-turnos-fijos/clientes-turnos-fijos.module';
import { CajasModule } from './cajas/cajas.module';
import { TurnosModule } from './turnos/turnos.module';
import { PagosTurnosModule } from './pagos-turnos/pagos-turnos.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [CanchasModule, ClientesModule, ClientesTurnosFijosModule, CajasModule, TurnosModule, PagosTurnosModule, EventsModule],
})
export class AppModule {}
