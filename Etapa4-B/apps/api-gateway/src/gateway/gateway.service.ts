import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class GatewayService {
  route(service: string, req: Request, res: Response, body: any) {
    const method = req.method;

    if (method === 'GET') {
      return this.handleQuery(service, req);
    }

    return this.handleCommand(service, method, req.originalUrl, body);
  }

  private handleCommand(service: string, method: string, url: string, body: any) {
    const comando = this.buildCommand(service, method, url, body);
    return {
      status: 202,
      message: 'Comando publicado al broker',
      comando,
      correlationId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  private async handleQuery(service: string, req: Request) {
    const url = req.originalUrl;
    return `Query: ${service} -> GET ${url} (consultado vía Query Service con Circuit Breaker)`;
  }

  private buildCommand(service: string, method: string, url: string, body: any) {
    const accion = url.replace(/^\//, '').replace(/\//g, '.');
    return {
      exchange: `${service}.commands`,
      routingKey: `${service}.${accion}.${method.toLowerCase()}`,
      payload: body || {},
    };
  }
}
