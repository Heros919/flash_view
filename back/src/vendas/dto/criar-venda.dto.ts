import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsInt,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ItemVendaDto {
  @IsInt()
  @IsPositive()
  produtoServicoId!: number;

  @IsNumber({ maxDecimalPlaces: 3 })
  @IsPositive()
  quantidade!: number;
}

export class CriarVendaDto {
  @IsInt()
  @IsPositive()
  clienteId!: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique((item: ItemVendaDto) => item.produtoServicoId)
  @ValidateNested({ each: true })
  @Type(() => ItemVendaDto)
  itens!: ItemVendaDto[];
}
