export type Papel = 'Funcionario' | 'Financeiro' | 'Adiministrador';
export type Usuario = {
    id: number;
    nome: string;
    email: string;
    senha: string;
    ativo: boolean;
    papel: string;
};
export type UsuarioAutenticado = Omit<Usuario, 'senha'>;
export declare class UsuarioService {
    private readonly usuario;
    buscarporemail(email: string): Usuario | undefined;
}
