import { Module } from '@nestjs/common';
import { TorneoService } from './torneos.service';
import { TorneoController } from './torneos.controller';

@Module({
  controllers: [TorneoController],
  providers: [TorneoService],
})
export class TorneoModule {}
