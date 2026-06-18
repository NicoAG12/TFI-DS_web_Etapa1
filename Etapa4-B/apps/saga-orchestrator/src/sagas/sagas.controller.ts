import { Controller, Get, Param, Delete } from '@nestjs/common';
import { SagasService } from './sagas.service';

@Controller('sagas')
export class SagasController {
  constructor(private readonly sagasService: SagasService) {}

  @Get()
  findAll() {
    return this.sagasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sagasService.findOne(+id);
  }

  @Delete(':id')
  cancel(@Param('id') id: string) {
    return this.sagasService.cancel(+id);
  }
}
