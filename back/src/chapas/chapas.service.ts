import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatChapas } from './dto/criar-chapas.dto';
import { AtualizarPrecoChapaDto } from './dto/atualizar-preco.dto';
import { AutualizarStatus } from './dto/autera-status.dto';
type Chapa = {
  id: number;
  codigo: string;
  blocoId: number;
  espessura: number;
  altura: number;
  largura: number;
  acabamento: string;
  preco: number;
  status: 'disponivel' | 'reservado' | 'vendido';
  dataCadastro: Date;
};

@Injectable()
export class ChapasService {
  private chapas: Chapa[] = [
    {
      id: 1,
      codigo: 'CH-001',
      blocoId: 101,
      espessura: 2,
      altura: 300,
      largura: 180,
      acabamento: 'polido',
      preco: 1500.0,
      status: 'disponivel',
      dataCadastro: new Date('2026-01-10')
    },
    {
      id: 2,
      codigo: 'CH-002',
      blocoId: 102,
      espessura: 3,
      altura: 280,
      largura: 160,
      acabamento: 'levigado',
      preco: 2000.0,
      status: 'reservado',
      dataCadastro: new Date('2026-02-05')
    },
    {
      id: 3,
      codigo: 'CH-003',
      blocoId: 103,
      espessura: 2,
      altura: 320,
      largura: 190,
      acabamento: 'flameado',
      preco: 1800.0,
      status: 'vendido',
      dataCadastro: new Date('2026-03-15')
    }
  ];

  criarChapas(dados: CreatChapas): Chapa {
    const novoId =
      this.chapas.length > 0
        ? Math.max(...this.chapas.map((c) => c.id)) + 1
        : 1;

    const novaChapa: Chapa = {
      id: novoId,
      ...dados,
      dataCadastro: new Date()
    };

    this.chapas.push(novaChapa);

    return novaChapa;
  }
  listar() {
    return this.chapas;
  }
  atualizarPreco(id: number, dto: AtualizarPrecoChapaDto) {
    const chapa = this.chapas.find((c) => c.id === id);

    if (!chapa) {
      throw new NotFoundException('Chapa não encontrada');
    }

    chapa.preco = dto.preco;

    return chapa;
  }
  atualizarStatus(id: number, dto: AutualizarStatus) {
    const chapa = this.chapas.find((C) => C.id === id);

    if (!chapa) {
      throw new NotFoundException('Chapa não encontrada');
    }

    chapa.status = dto.status;

    return chapa;
  }
}
