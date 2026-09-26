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
export declare class ChapasService {
    private chapas;
    criarChapas(dados: CreatChapas): Chapa;
    listar(): Chapa[];
}
export {};
