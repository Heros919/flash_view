import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';

export class RegistroDto {
  @IsString()
  @Matches(/^\d{11}$/, { message: 'cpf deve ter 11 dígitos numéricos' })
  cpf!: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value
  )
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  nome!: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value
  )
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  senha!: string;
}
