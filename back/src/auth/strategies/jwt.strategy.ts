import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  UsuarioAutenticado,
  UsuarioService
} from '../../usuario/usuario.service';

export type JwtPayload = { sub: string | number; email: string; papel: string };

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

  async validate(payload: JwtPayload): Promise<UsuarioAutenticado> {
    const usuario = await this.usuarioService.buscarPorId(payload.sub);
    if (!usuario || !usuario.ativo) throw new UnauthorizedException();
    return this.usuarioService.semSenha(usuario);
  }
}
