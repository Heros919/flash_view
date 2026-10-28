import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CriarProdutoDto {
  @IsInt()
  @IsPositive()
  clienteId!: number;

  @IsInt()
  @IsPositive()
  tipoId!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nome!: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  preco!: number;
}
