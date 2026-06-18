import { Injectable } from '@nestjs/common';

@Injectable()
export class CircuitBreakerService {
  private breakers: Map<string, { estado: 'CERRADO' | 'ABIERTO' | 'SEMI_ABIERTO'; fallos: number; ultimoFallo: number }> = new Map();

  async call<T>(servicio: string, fn: () => Promise<T>): Promise<T> {
    const breaker = this.getOrCreate(servicio);

    if (breaker.estado === 'ABIERTO') {
      const tiempoTranscurrido = Date.now() - breaker.ultimoFallo;
      if (tiempoTranscurrido > 30000) {
        breaker.estado = 'SEMI_ABIERTO';
      } else {
        throw new Error(`Servicio ${servicio} no disponible. Circuito ABIERTO.`);
      }
    }

    try {
      const result = await fn();
      breaker.estado = 'CERRADO';
      breaker.fallos = 0;
      return result;
    } catch (error) {
      breaker.fallos++;
      breaker.ultimoFallo = Date.now();
      if (breaker.fallos >= 3) {
        breaker.estado = 'ABIERTO';
      }
      throw error;
    }
  }

  private getOrCreate(servicio: string) {
    if (!this.breakers.has(servicio)) {
      this.breakers.set(servicio, { estado: 'CERRADO', fallos: 0, ultimoFallo: 0 });
    }
    return this.breakers.get(servicio)!;
  }
}
