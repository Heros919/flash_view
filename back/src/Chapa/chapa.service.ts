import { Injectable } from '@nestjs/common';
import { CreateChapas } from './dto/criar-chapa.dto';
type Chapa = {
  id: number;
  codigo: string;
  material: string;
  cor: string;
  altura: number;
  largura: number;
  acabamento: number;
  peso: number;
  dataCadastro: Date;
  status?: string;
};
@Injectable()
export class ChapasService {
  private chapas: Chapa[] = [
    {
      id: 1,
      codigo: 'CP001',
      material: 'Concreto',
      cor: 'Cinza',
      altura: 20,
      largura: 10,
      acabamento: 1,
      peso: 5,
      dataCadastro: new Date('2023-01-01'),
      status: 'Disponível'
    },
    {
      id: 2,
      codigo: 'CP002',
      material: 'Cerâmica',
      cor: 'Vermelho',
      altura: 15,
      largura: 7,
      acabamento: 2,
      peso: 3,
      dataCadastro: new Date('2023-02-15'),
      status: 'Vendido'
    }
  ];
  criarChapa(dados: CreateChapas): Chapa {
    const novoId =
      this.chapas.length > 0
        ? Math.max(...this.chapas.map((c) => c.id)) + 1
        : 1;

    const novaChapa: Chapa = { id: novoId, ...dados };
    this.chapas.push(novaChapa);
    return novaChapa;
  }
  listarChapas() {
    return this.chapas;
  }
}
