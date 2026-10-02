import {
  IsEnum,
  IsInt,
  IsNotEmpty,
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

export class CreateBlocos {
  // O cliente_id é descoberto a partir do funcionário (ver service)
  @IsString()
  @IsNotEmpty()
  funcionarioId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codigo!: string;

  @IsInt()
  @Min(0)
  @Max(99)
  numero!: number;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  material?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  cor?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  altura!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  largura!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  comprimento!: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  peso?: number;

  @IsInt()
  @Min(1)
  @Max(12)
  mes!: number;

  @IsInt()
  @Min(2000)
  ano!: number;

  @IsEnum(FrenteBloco)
  frente!: FrenteBloco;
}