import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EsperasService } from './esperas.service';
import { CreateEsperaDto } from './dto/create-espera.dto';
import { UpdateEsperaDto } from './dto/update-espera.dto';

@Controller('esperas')
export class EsperasController {
  constructor(private readonly esperasService: EsperasService) {}

  @Post()
  create(@Body() createEsperaDto: CreateEsperaDto) {
    return this.esperasService.create(createEsperaDto);
  }

  @Get()
  findAll() {
    return this.esperasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.esperasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEsperaDto: UpdateEsperaDto) {
    return this.esperasService.update(+id, updateEsperaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.esperasService.remove(+id);
  }
}
