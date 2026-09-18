import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  UsuarioAutenticado,
  UsuarioService
} from '../../usuario/usuario.service';

export type JwtPayload = { sub: number; email: string; papel: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly usuarioService: UsuarioService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET')
    });
  }

  // Busca o usuário de novo: papel atualizado e bloqueio de quem foi desativado/excluído
  validate(payload: JwtPayload): UsuarioAutenticado {
    const usuario = this.usuarioService.buscarPorId(payload.sub);
    if (!usuario || !usuario.ativo) throw new UnauthorizedException();
    return this.usuarioService.semSenha(usuario);
  }
}
