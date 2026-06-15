import { Module } from '@nestjs/common';
import { CanchaService } from './canchas.service';
import { CanchaController } from './canchas.controller';

@Module({
  controllers: [CanchaController],
  providers: [CanchaService],
})
export class CanchaModule {}
