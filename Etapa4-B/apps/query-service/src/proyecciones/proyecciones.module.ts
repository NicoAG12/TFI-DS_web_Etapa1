import { Module } from '@nestjs/common';
import { ProyeccionesService } from './proyecciones.service';
import { ProyeccionesController } from './proyecciones.controller';

@Module({
  controllers: [ProyeccionesController],
  providers: [ProyeccionesService],
})
export class ProyeccionesModule {}
