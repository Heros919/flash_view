import {
  IsEnum,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from "class-validator";
import { Type } from "class-transformer";
import { PapelConta } from "../../generated/prisma/enums";

export class RegistroDto {
  @IsString()
  @Length(11, 11)
  cpf!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  nome!: string;

  @IsEmail()
  @Length(1, 255)
  email!: string;

  @IsString()
  @MinLength(8)
  senha!: string;

  @IsOptional()
  @IsEnum(PapelConta)
  papel?: PapelConta;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  clienteId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  adminId?: number;
}
