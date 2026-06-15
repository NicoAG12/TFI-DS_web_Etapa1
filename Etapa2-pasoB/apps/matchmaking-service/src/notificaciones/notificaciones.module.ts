import { Module } from '@nestjs/common';
import { NotificacionService } from './notificaciones.service';
import { NotificacionController } from './notificaciones.controller';

@Module({
  controllers: [NotificacionController],
  providers: [NotificacionService],
})
export class NotificacionModule {}
