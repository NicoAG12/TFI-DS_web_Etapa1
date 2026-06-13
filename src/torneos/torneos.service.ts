import { Injectable } from '@nestjs/common';
import { CreateTorneoDto } from './dto/create-torneo.dto';
import { UpdateTorneoDto } from './dto/update-torneo.dto';

@Injectable()
export class TorneosService {
  create(createTorneoDto: CreateTorneoDto) {
    return 'This action adds a new torneo';
  }

  findAll() {
    return `This action returns all torneos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} torneo`;
  }

  update(id: number, updateTorneoDto: UpdateTorneoDto) {
    return `This action updates a #${id} torneo`;
  }

  remove(id: number) {
    return `This action removes a #${id} torneo`;
  }
}
