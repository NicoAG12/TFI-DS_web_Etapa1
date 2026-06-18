import { Module } from '@nestjs/common';
import { QueryAggregatorService } from './query-aggregator.service';

@Module({
  providers: [QueryAggregatorService],
  exports: [QueryAggregatorService],
})
export class AggregatorModule {}
