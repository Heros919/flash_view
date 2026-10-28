import {
  IsEmail,
  IsIn,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PapelConta } from '../../generated/prisma/enums';

export class CriarUsuarioDto {
  @IsString()
  @Length(11, 11)
  cpf!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(150)
  nome!: string;

  @IsEmail()
  @MaxLength(255)
  email!: string;

  @IsString()
  @MinLength(8)
  senha!: string;

  @IsIn([PapelConta.ADMINISTRADOR, PapelConta.FINANCEIRO])
  papel!: typeof PapelConta.ADMINISTRADOR | typeof PapelConta.FINANCEIRO;
}
