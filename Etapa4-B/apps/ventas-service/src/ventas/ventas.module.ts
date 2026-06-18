import { Module } from '@nestjs/common';
import { VentaService } from './ventas.service';
import { VentaController } from './ventas.controller';

@Module({
  controllers: [VentaController],
  providers: [VentaService],
})
export class VentaModule {}
