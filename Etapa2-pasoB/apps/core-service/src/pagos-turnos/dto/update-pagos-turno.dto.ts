import { PartialType } from '@nestjs/mapped-types';
import { CreatePagosTurnoDto } from './create-pagos-turno.dto';

export class UpdatePagosTurnoDto extends PartialType(CreatePagosTurnoDto) {}
