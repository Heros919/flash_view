import { IsEnum } from 'class-validator';

export enum StatusChapas {
  DISPONIVEL = 'disponivel',
  RESERVADO = 'reservado',
  VENDIDO = 'vendido'
}

export class AutualizarStatus {
  @IsEnum(StatusChapas)
  status!: StatusChapas;
}
