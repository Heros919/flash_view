import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength
} from 'class-validator';
import { StatusChapas } from './autera-status.dto';

export class CreatChapas {
  // O cliente_id é descoberto a partir do funcionário (ver service)
  @IsString()
  @IsNotEmpty()
  funcionarioId!: string;

  @IsString()
  @IsNotEmpty()
  blocoId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codigo!: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  espessura?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  altura?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  largura?: number;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  acabamento?: string;

  // Se não vier, o banco usa DISPONIVEL
  @IsOptional()
  @IsEnum(StatusChapas)
  status?: StatusChapas;
}