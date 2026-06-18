import { PartialType } from '@nestjs/mapped-types';
import { CreateEsperaDto } from './create-espera.dto';

export class UpdateEsperaDto extends PartialType(CreateEsperaDto) {}
