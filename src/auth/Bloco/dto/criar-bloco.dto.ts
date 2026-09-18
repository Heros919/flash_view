import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateBlocos {
  @IsString()
  @IsNotEmpty()
  codigo!: string;

  @IsString()
  @IsNotEmpty()
  material!: string;

  @IsString()
  @IsNotEmpty()
  cor!: string;

  @IsNumber()
  @Min(0)
  altura!: number;

  @IsNumber()
  @Min(0)
  largura!: number;

  @IsNumber()
  @Min(0)
  comprimento!: number;

  @IsNumber()
  @Min(0)
  peso!: number;

  @IsDate()
  @Type(() => Date)
  dataCadastro!: Date;
}
