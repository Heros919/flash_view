import { Injectable } from '@nestjs/common';
import { CreatChapas } from './dto/criar-chapas.dto';

type Chapa = {
  id: number;
  codigo: string;
  blocoId: number;
  espessura: number;
  altura: number;
  largura: number;
  acabamento: string;
  status: 'disponivel' | 'reservado' | 'vendido';
  dataCadastro: Date;
};

@Injectable()
export class ChapasService {
  private chapas: Chapa[] = [];

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
}
