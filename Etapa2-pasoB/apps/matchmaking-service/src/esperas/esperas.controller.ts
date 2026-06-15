import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EsperaService } from './esperas.service';
import { CreateEsperaDto } from './dto/create-espera.dto';
import { UpdateEsperaDto } from './dto/update-espera.dto';

@Controller('esperas')
export class EsperaController {
  constructor(private readonly esperaService: EsperaService) {}

  @Post()
  create(@Body() createEsperaDto: CreateEsperaDto) {
    return this.esperaService.create(createEsperaDto);
  }

  @Get()
  findAll() {
    return this.esperaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.esperaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEsperaDto: UpdateEsperaDto) {
    return this.esperaService.update(+id, updateEsperaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.esperaService.remove(+id);
  }
}
