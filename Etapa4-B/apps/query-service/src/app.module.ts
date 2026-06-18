import { Module } from '@nestjs/common';
import { ProyeccionesModule } from './proyecciones/proyecciones.module';
import { EventosModule } from './eventos/eventos.module';

@Module({
  imports: [ProyeccionesModule, EventosModule],
})
export class AppModule {}
