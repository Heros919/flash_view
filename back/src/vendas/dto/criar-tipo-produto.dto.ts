import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CriarTipoProdutoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nome!: string;
}
