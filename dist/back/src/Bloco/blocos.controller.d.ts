import { BlocosService } from './blocos.service';
import { CreateBlocos } from './dto/criar-bloco.dto';
export declare class BlocosController {
    private readonly blocosService;
    constructor(blocosService: BlocosService);
    criar(body: CreateBlocos): {
        id: number;
        codigo: string;
        material: string;
        cor: string;
        altura: number;
        largura: number;
        comprimento: number;
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
        comprimento: number;
        peso: number;
        dataCadastro: Date;
        status?: string;
    }[];
}
