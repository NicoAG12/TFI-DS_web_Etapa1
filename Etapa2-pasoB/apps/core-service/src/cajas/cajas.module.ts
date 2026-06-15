import { Module } from '@nestjs/common';
import { CajaService } from './cajas.service';
import { CajaController } from './cajas.controller';

@Module({
  controllers: [CajaController],
  providers: [CajaService],
})
export class CajaModule {}
