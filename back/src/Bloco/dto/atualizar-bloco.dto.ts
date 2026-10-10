import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min
} from 'class-validator';



export enum FrenteBloco {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  BARRAGEM = 'BARRAGEM',
  BARREIRO = 'BARREIRO'
}

export class AtualizarBlocoDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  codigo?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(99)
  numero?: number;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  material?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  cor?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  altura?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  largura?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  comprimento?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  peso?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  mes?: number;

  @IsOptional()
  @IsInt()
  @Min(2000)
  ano?: number;

  @IsOptional()
  @IsEnum(FrenteBloco)
  frente?: FrenteBloco;
}