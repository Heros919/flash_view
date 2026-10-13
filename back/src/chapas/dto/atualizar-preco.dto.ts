import { IsNumber, IsPositive } from 'class-validator';

export class AtualizarPrecoChapaDto {
  @IsNumber()
  @IsPositive()
  preco!: number;
}
