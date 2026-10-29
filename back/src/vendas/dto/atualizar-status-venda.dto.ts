import { IsIn } from 'class-validator';

export class AtualizarStatusVendaDto {
  @IsIn(['ABERTA', 'PAGA', 'CANCELADA'])
  status!: 'ABERTA' | 'PAGA' | 'CANCELADA';
}
