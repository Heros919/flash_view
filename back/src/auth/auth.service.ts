import { Injectable } from '@nestjs/common';
import {
  Usuario,
  UsuarioAutenticado,
  UsuarioService
} from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

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
    console.log('--- TESTE DE AUTENTICAÇÃO ---');
    console.log('Email recebido:', email);

    const usuario = await this.usuarioService.buscarporemail(email);
    console.log('Usuário retornado:', usuario);

    if (!usuario || !usuario.ativo) {
      console.log('Falha: Usuário não existe ou está inativo');
      return null;
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    console.log('Senha válida?:', senhaValida);

    if (!senhaValida) {
      console.log('Falha: Senha incorreta');
      return null;
    }

    const { senha: _senha, ...principal } = usuario;
    return principal;
  }

  
  login(usuario: UsuarioAutenticado) {
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