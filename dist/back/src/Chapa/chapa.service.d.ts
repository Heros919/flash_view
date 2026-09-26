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
export declare class ChapasService {
    private chapas;
    criarChapa(dados: CreateChapas): Chapa;
    listarChapas(): Chapa[];
}
export {};
