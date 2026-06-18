import { Injectable } from '@nestjs/common';
import { CreatePagosTurnoDto } from './dto/create-pagos-turno.dto';
import { UpdatePagosTurnoDto } from './dto/update-pagos-turno.dto';

@Injectable()
export class PagosTurnoService {
  create(createPagosTurnoDto: CreatePagosTurnoDto) {
    return 'This action adds a new pagos-turno';
  }

  findAll() {
    return `This action returns all pagos-turnos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pagos-turno`;
  }

  update(id: number, updatePagosTurnoDto: UpdatePagosTurnoDto) {
    return `This action updates a #${id} pagos-turno`;
  }

  remove(id: number) {
    return `This action removes a #${id} pagos-turno`;
  }
}
