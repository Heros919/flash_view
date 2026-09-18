import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioAutenticado, UsuarioService } from '../usuario/usuario.service';

// Usado para gastar o mesmo tempo quando o e-mail não existe (evita enumeração de usuários)
const HASH_FALSO = bcrypt.hashSync('senha-falsa', 10);

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService
  ) {}

  async validarUsuario(
    email: string,
    senha: string
  ): Promise<UsuarioAutenticado | null> {
    const usuario = this.usuarioService.buscarPorEmail(email);
    const senhaValida = await bcrypt.compare(
      senha,
      usuario?.senhaHash ?? HASH_FALSO
    );

    if (!usuario || !usuario.ativo || !senhaValida) return null;
    return this.usuarioService.semSenha(usuario);
  }

  login(usuario: UsuarioAutenticado) {
    const payload = {
      sub: usuario.id,
      email: usuario.email,
      papel: usuario.papel
    };
    return { acesso: this.jwtService.sign(payload) };
  }
}
