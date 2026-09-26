// create-chapas.dto.ts
import { IsString, IsNumber, IsEnum } from 'class-validator';

export enum StatusChapas {
  DISPONIVEL = 'disponivel',
  RESERVADO = 'reservado',
  VENDIDO = 'vendido'
}

export class CreatChapas {
  @IsString()
  codigo!: string;

  @IsNumber()
  blocoId!: number;

  @IsNumber()
  espessura!: number;

  @IsNumber()
  altura!: number;

  @IsNumber()
  largura!: number;

  @IsString()
  acabamento!: string;

  @IsEnum(StatusChapas)
  status!: StatusChapas;
}
