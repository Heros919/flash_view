import { IsEnum } from 'class-validator';


export enum StatusChapas {
  DISPONIVEL = 'DISPONIVEL',
  RESERVADO = 'RESERVADO',
  VENDIDO = 'VENDIDO'
}

export class AutualizarStatus {
  @IsEnum(StatusChapas)
  status!: StatusChapas;
}