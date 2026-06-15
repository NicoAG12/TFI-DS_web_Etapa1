import { Injectable } from '@nestjs/common';

@Injectable()
export class ProyeccionEventsService {
  onTurnoCreado(payload: any) {
    return `Proyección actualizada: INSERT INTO turnos_del_dia VALUES (${payload.turnoId}, ...)`;
  }

  onTurnoCancelado(payload: any) {
    return `Proyección actualizada: DELETE FROM turnos_del_dia WHERE turno_id = ${payload.turnoId}`;
  }

  onPagoRegistrado(payload: any) {
    return `Proyección actualizada: UPDATE turnos_del_dia SET pago_estado = 'PAGADO' WHERE turno_id = ${payload.turnoId}`;
  }

  onMovimientoCaja(payload: any) {
    return `Proyección actualizada: UPDATE estado_caja SET saldo = saldo + ${payload.monto} WHERE caja_id = ${payload.cajaId}`;
  }

  onVentaRealizada(payload: any) {
    return `Proyección actualizada: UPDATE estado_caja + INSERT INTO dashboard_ventas`;
  }

  onUsuarioCreado(payload: any) {
    return `Cache actualizado: INSERT INTO usuarios_cache VALUES (${payload.usuarioId}, ...)`;
  }
}
