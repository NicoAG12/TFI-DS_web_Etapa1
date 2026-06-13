import { Injectable } from '@nestjs/common';
import { CreatePagosTurnoDto } from './dto/create-pagos-turno.dto';
import { UpdatePagosTurnoDto } from './dto/update-pagos-turno.dto';

@Injectable()
export class PagosTurnosService {
  create(createPagosTurnoDto: CreatePagosTurnoDto) {
    return 'This action adds a new pagosTurno';
  }

  findAll() {
    return `This action returns all pagosTurnos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pagosTurno`;
  }

  update(id: number, updatePagosTurnoDto: UpdatePagosTurnoDto) {
    return `This action updates a #${id} pagosTurno`;
  }

  remove(id: number) {
    return `This action removes a #${id} pagosTurno`;
  }
}
