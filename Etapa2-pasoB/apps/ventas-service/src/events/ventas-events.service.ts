import { Injectable } from '@nestjs/common';

@Injectable()
export class VentasEventsService {
  publishVentaRealizada(ventaId: number) {
    return `Evento publicado: venta.realizada { id: ${ventaId} }`;
  }

  publishVentaAnulada(ventaId: number) {
    return `Evento publicado: venta.anulada { id: ${ventaId} }`;
  }

  publishProductoActualizado(productoId: number) {
    return `Evento publicado: producto.actualizado { id: ${productoId} }`;
  }
}
