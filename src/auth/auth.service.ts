import { Injectable } from '@nestjs/common';
import {
  Usuario,
  UsuaioAutenticado,
  UsuarioService
} from 'src/usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService
  ) {}

  async validarUsuario(
    email: string,
    senha: string
  ): Promise<UsuaioAutenticado | null> {
    const usuario = this.usuarioService.buscarporemail(email);

    if (!usuario || !usuario.ativo) {
      return null;
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return null;
    }

    const { senha: _senha, ...principal } = usuario;
    return principal;
  }

  login(usuario: UsuaioAutenticado) {
    const payload = {
      sub: usuario.id,
      email: usuario.email,
      papel: usuario.papel
    };
    return {
      acesso: this.jwtService.sign(payload)
    };
  }
}
