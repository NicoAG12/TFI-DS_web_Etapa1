import { Injectable } from '@nestjs/common';
import { CreateEsperaDto } from './dto/create-espera.dto';
import { UpdateEsperaDto } from './dto/update-espera.dto';

@Injectable()
export class EsperaService {
  create(createEsperaDto: CreateEsperaDto) {
    return 'This action adds a new espera';
  }
  findAll() {
    return `This action returns all esperas`;
  }
  findOne(id: number) {
    return `This action returns a #${id} espera`;
  }
  update(id: number, updateEsperaDto: UpdateEsperaDto) {
    return `This action updates a #${id} espera`;
  }
  remove(id: number) {
    return `This action removes a #${id} espera`;
  }
}
