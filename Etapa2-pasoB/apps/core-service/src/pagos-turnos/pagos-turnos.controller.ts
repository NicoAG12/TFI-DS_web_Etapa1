import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PagosTurnoService } from './pagos-turnos.service';
import { CreatePagosTurnoDto } from './dto/create-pagos-turno.dto';
import { UpdatePagosTurnoDto } from './dto/update-pagos-turno.dto';

@Controller('pagos-turnos')
export class PagosTurnoController {
  constructor(private readonly pagos-turnoService: PagosTurnoService) {}

  @Post()
  create(@Body() createPagosTurnoDto: CreatePagosTurnoDto) {
    return this.pagos-turnoService.create(createPagosTurnoDto);
  }

  @Get()
  findAll() {
    return this.pagos-turnoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagos-turnoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePagosTurnoDto: UpdatePagosTurnoDto) {
    return this.pagos-turnoService.update(+id, updatePagosTurnoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagos-turnoService.remove(+id);
  }
}
