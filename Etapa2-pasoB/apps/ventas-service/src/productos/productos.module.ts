import { Module } from '@nestjs/common';
import { ProductoService } from './productos.service';
import { ProductoController } from './productos.controller';

@Module({
  controllers: [ProductoController],
  providers: [ProductoService],
})
export class ProductoModule {}
