import { IsString, MinLength } from 'class-validator';
import { RegistroDto } from './registro.dto';

export class BootstrapContaDto extends RegistroDto {
  @IsString()
  @MinLength(32)
  chave!: string;
}
