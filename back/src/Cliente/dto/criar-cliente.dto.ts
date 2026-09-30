// create-chapas.dto.ts
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreatCliente {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsNumber()
  @IsNotEmpty()
  cpf!: number;

  @IsNumber()
  @IsNotEmpty()
  telefone!: number;
}
