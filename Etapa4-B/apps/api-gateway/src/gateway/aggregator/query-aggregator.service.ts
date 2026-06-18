import { Injectable } from '@nestjs/common';

@Injectable()
export class QueryAggregatorService {
  async aggregateDashboard(): Promise<any> {
    const turnos = { endpoint: '/proyecciones/turnos-del-dia?fecha=hoy', data: '[turnos...]' };
    const caja = { endpoint: '/proyecciones/estado-caja?cajaId=1', data: '{ saldo: 5000 }' };
    const ventas = { endpoint: '/proyecciones/dashboard', data: '{ total: 15000 }' };

    return {
      turnosDelDia: turnos.data,
      estadoCaja: caja.data,
      dashboardVentas: ventas.data,
      timestamp: new Date().toISOString(),
    };
  }

  async aggregateTurnoDetalle(turnoId: number): Promise<any> {
    return {
      respuesta: `Agregación de turno #${turnoId}: turno + cancha + cliente + pago (desde Query Service)`,
    };
  }
}
