import { IsIn } from 'class-validator';

export class AtualizarStatusVendaDto {
  @IsIn(['ABERTA', 'FECHADA', 'CANCELADA'])
  status!: 'ABERTA' | 'FECHADA' | 'CANCELADA';
}
