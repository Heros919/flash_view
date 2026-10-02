import { IsEnum } from 'class-validator';

// Valores iguais aos do CHECK da tabela chapa no banco
export enum StatusChapas {
  DISPONIVEL = 'DISPONIVEL',
  RESERVADO = 'RESERVADO',
  VENDIDO = 'VENDIDO'
}

export class AutualizarStatus {
  @IsEnum(StatusChapas)
  status!: StatusChapas;
}