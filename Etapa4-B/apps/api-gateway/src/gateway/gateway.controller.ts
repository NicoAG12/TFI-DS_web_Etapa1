import { Controller, All, Param, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { GatewayService } from './gateway.service';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @All('auth/*')
  handleAuth(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    return this.gatewayService.route('auth', req, res, body);
  }

  @All('usuarios/*')
  handleUsuarios(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    return this.gatewayService.route('auth', req, res, body);
  }

  @All('canchas/*')
  handleCanchas(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    return this.gatewayService.route('core', req, res, body);
  }

  @All('clientes/*')
  handleClientes(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    return this.gatewayService.route('core', req, res, body);
  }

  @All('turnos/*')
  handleTurnos(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    return this.gatewayService.route('core', req, res, body);
  }

  @All('pagos-turnos/*')
  handlePagosTurnos(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    return this.gatewayService.route('core', req, res, body);
  }

  @All('cajas/*')
  handleCajas(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    return this.gatewayService.route('core', req, res, body);
  }

  @All('clientes-turnos-fijos/*')
  handleClientesTurnosFijos(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    return this.gatewayService.route('core', req, res, body);
  }

  @All('ventas/*')
  handleVentas(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    return this.gatewayService.route('ventas', req, res, body);
  }

  @All('productos/*')
  handleProductos(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    return this.gatewayService.route('ventas', req, res, body);
  }

  @All('torneos/*')
  handleTorneos(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    return this.gatewayService.route('torneos', req, res, body);
  }

  @All('esperas/*')
  handleEsperas(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    return this.gatewayService.route('matchmaking', req, res, body);
  }

  @All('matchmaking/*')
  handleMatchmaking(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    return this.gatewayService.route('matchmaking', req, res, body);
  }

  @All('notificaciones/*')
  handleNotificaciones(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    return this.gatewayService.route('matchmaking', req, res, body);
  }
}
