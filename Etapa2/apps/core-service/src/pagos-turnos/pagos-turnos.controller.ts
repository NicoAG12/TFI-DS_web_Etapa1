import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PagosTurnosService } from './pagos-turnos.service';
import { CreatePagosTurnoDto } from './dto/create-pagos-turno.dto';
import { UpdatePagosTurnoDto } from './dto/update-pagos-turno.dto';

@Controller('pagos-turnos')
export class PagosTurnosController {
  constructor(private readonly pagosTurnosService: PagosTurnosService) {}

  @Post()
  create(@Body() createPagosTurnoDto: CreatePagosTurnoDto) {
    return this.pagosTurnosService.create(createPagosTurnoDto);
  }

  @Get()
  findAll() {
    return this.pagosTurnosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagosTurnosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePagosTurnoDto: UpdatePagosTurnoDto) {
    return this.pagosTurnosService.update(+id, updatePagosTurnoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagosTurnosService.remove(+id);
  }
}
