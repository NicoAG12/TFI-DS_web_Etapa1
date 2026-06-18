import { Module } from '@nestjs/common';
import { ProductosModule } from './productos/productos.module';
import { VentasModule } from './ventas/ventas.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [ProductosModule, VentasModule, EventsModule],
})
export class AppModule {}
