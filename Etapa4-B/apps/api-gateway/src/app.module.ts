import { Module } from '@nestjs/common';
import { GatewayModule } from './gateway/gateway.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [GatewayModule, WebsocketModule],
})
export class AppModule {}
