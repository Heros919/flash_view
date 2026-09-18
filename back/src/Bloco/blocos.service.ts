import { Injectable } from '@nestjs/common';
import { CreateBlocos } from './dto/criar-bloco.dto';
type Bloco = {
  id: number;
  codigo: string;
  material: string;
  cor: string;
  altura: number;
  largura: number;
  comprimento: number;
  peso: number;
  dataCadastro: Date;
};
@Injectable()
export class BlocosService {
  private blocos: Bloco[] = [
    {
      id: 1,
      codigo: 'BL001',
      material: 'Concreto',
      cor: 'Cinza',
      altura: 20,
      largura: 10,
      comprimento: 30,
      peso: 5,
      dataCadastro: new Date('2023-01-01')
    },
    {
      id: 2,
      codigo: 'BL002',
      material: 'Cerâmica',
      cor: 'Vermelho',
      altura: 15,
      largura: 7,
      comprimento: 25,
      peso: 3,
      dataCadastro: new Date('2023-02-15')
    }
  ];
  criarBloco(dados: CreateBlocos): Bloco {
    const novoId =
      this.blocos.length > 0
        ? Math.max(...this.blocos.map((b) => b.id)) + 1
        : 1;

    const novoBloco: Bloco = { id: novoId, ...dados };
    this.blocos.push(novoBloco);
    return novoBloco;
  }
  listas() {
    return this.blocos;
  }
}
