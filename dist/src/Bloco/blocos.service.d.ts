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
export declare class BlocosService {
    private blocos;
    criarBloco(dados: CreateBlocos): Bloco;
    listas(): Bloco[];
}
export {};
