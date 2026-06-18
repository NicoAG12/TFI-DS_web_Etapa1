import { Injectable } from '@nestjs/common';

@Injectable()
export class CoreEventsService {
  publishTurnoCreado(turnoId: number) {
    return `Evento publicado: turno.creado { id: ${turnoId} }`;
  }

  publishTurnoCancelado(turnoId: number) {
    return `Evento publicado: turno.cancelado { id: ${turnoId} }`;
  }

  publishTurnoActualizado(turnoId: number) {
    return `Evento publicado: turno.actualizado { id: ${turnoId} }`;
  }

  publishPagoRegistrado(pagoId: number, turnoId: number) {
    return `Evento publicado: pago.registrado { id: ${pagoId}, turnoId: ${turnoId} }`;
  }

  publishPagoRechazado(pagoId: number, motivo: string) {
    return `Evento publicado: pago.rechazado { id: ${pagoId}, motivo: ${motivo} }`;
  }

  publishMovimientoCaja(cajaId: number, monto: number) {
    return `Evento publicado: caja.movimiento { cajaId: ${cajaId}, monto: ${monto} }`;
  }
}
