import { CreateChapas } from './dto/criar-chapa.dto';
import { ChapasService } from './chapa.service';
export declare class ChapasController {
    private readonly chapasService;
    constructor(chapasService: ChapasService);
    criar(body: CreateChapas): {
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
    listar(): {
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
    }[];
}
