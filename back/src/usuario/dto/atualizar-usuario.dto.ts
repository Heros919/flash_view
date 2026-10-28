import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PapelConta } from '../../generated/prisma/enums';

export class AtualizarUsuarioDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  nome?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @IsOptional()
  @IsIn([PapelConta.ADMINISTRADOR, PapelConta.FINANCEIRO])
  papel?: typeof PapelConta.ADMINISTRADOR | typeof PapelConta.FINANCEIRO;
}
