import { Controller, Get, Query } from '@nestjs/common';
import { ProyeccionesService } from './proyecciones.service';

@Controller('proyecciones')
export class ProyeccionesController {
  constructor(private readonly proyeccionesService: ProyeccionesService) {}

  @Get('turnos-del-dia')
  getTurnosDelDia(@Query('fecha') fecha: string) {
    return this.proyeccionesService.getTurnosDelDia(fecha);
  }

  @Get('estado-caja')
  getEstadoCaja(@Query('cajaId') cajaId: string) {
    return this.proyeccionesService.getEstadoCaja(+cajaId);
  }

  @Get('dashboard')
  getDashboard() {
    return this.proyeccionesService.getDashboard();
  }
}
