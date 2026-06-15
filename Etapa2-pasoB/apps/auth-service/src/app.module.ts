import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [AuthModule, UsuariosModule, EventsModule],
})
export class AppModule {}
