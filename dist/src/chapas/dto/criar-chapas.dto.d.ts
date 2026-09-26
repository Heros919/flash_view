export declare enum StatusChapas {
    DISPONIVEL = "disponivel",
    RESERVADO = "reservado",
    VENDIDO = "vendido"
}
export declare class CreatChapas {
    codigo: string;
    blocoId: number;
    espessura: number;
    altura: number;
    largura: number;
    acabamento: string;
    status: StatusChapas;
}
