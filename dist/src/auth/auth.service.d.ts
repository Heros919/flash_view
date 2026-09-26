import { JwtService } from '@nestjs/jwt';
import { UsuarioAutenticado, UsuarioService } from '../usuario/usuario.service';
export declare class AuthService {
    private readonly usuarioService;
    private readonly jwtService;
    constructor(usuarioService: UsuarioService, jwtService: JwtService);
    validarUsuario(email: string, senha: string): Promise<UsuarioAutenticado | null>;
    login(usuario: UsuarioAutenticado): {
        acesso: string;
    };
}
