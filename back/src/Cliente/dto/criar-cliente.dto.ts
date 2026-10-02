import { IsString, IsNotEmpty, Matches, MaxLength } from 'class-validator';

export class CreatCliente {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome!: string;

  @IsString()
  @Matches(/^[0-9]{11}$/, { message: 'cpf deve ter 11 dígitos numéricos' })
  cpf!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  numero!: string;
}