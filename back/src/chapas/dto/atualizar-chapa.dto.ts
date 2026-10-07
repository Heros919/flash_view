import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

// O status continua sendo alterado por PATCH /chapas/:id/status (Financeiro).
export class AtualizarChapaDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codigo?: string;

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
}