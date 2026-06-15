import { Module } from '@nestjs/common';
import { ClienteService } from './clientes.service';
import { ClienteController } from './clientes.controller';

@Module({
  controllers: [ClienteController],
  providers: [ClienteService],
})
export class ClienteModule {}
