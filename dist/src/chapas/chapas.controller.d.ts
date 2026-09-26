import { ChapasService } from './chapas.service';
import { CreatChapas } from './dto/criar-chapas.dto';
export declare class ChapasController {
    private readonly chapasservice;
    constructor(chapasservice: ChapasService);
    criar(body: CreatChapas): {
        id: number;
        codigo: string;
        blocoId: number;
        espessura: number;
        altura: number;
        largura: number;
        acabamento: string;
        status: "disponivel" | "reservado" | "vendido";
        dataCadastro: Date;
    };
    listar(): {
        id: number;
        codigo: string;
        blocoId: number;
        espessura: number;
        altura: number;
        largura: number;
        acabamento: string;
        status: "disponivel" | "reservado" | "vendido";
        dataCadastro: Date;
    }[];
}
