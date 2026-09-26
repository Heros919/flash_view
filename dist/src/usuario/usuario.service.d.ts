export declare enum Papel {
    Funcionario = "FUNCIONARIO",
    Financeiro = "FINANCEIRO",
    Administrador = "ADMINISTRADOR"
}
export type Usuario = {
    cpf: number;
    nome: string;
    email: string;
    senhaHash: string;
    ativo: boolean;
    papel: Papel;
};
export type UsuarioAutenticado = Omit<Usuario, 'senhaHash'>;
export declare class UsuarioService {
    private readonly usuarios;
    buscarPorEmail(email: string): Usuario | undefined;
    buscarPorId(cpf: number): Usuario | undefined;
    semSenha(usuario: Usuario): UsuarioAutenticado;
}
