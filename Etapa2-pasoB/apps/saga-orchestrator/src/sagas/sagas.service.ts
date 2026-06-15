import { Injectable } from '@nestjs/common';

@Injectable()
export class SagasService {
  findAll() {
    return `This action returns all sagas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} saga`;
  }

  cancel(id: number) {
    return `This action cancels a #${id} saga`;
  }
}
