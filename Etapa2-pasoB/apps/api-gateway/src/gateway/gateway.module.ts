import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { CircuitBreakerModule } from './circuit-breaker/circuit-breaker.module';
import { AggregatorModule } from './aggregator/aggregator.module';

@Module({
  controllers: [GatewayController],
  providers: [GatewayService],
  imports: [CircuitBreakerModule, AggregatorModule],
})
export class GatewayModule {}
