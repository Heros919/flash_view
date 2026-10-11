import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PrismaService } from '../../prisma/prisma.service';

type JwtPayload = {
  sub: string;
  email: string;
  papel: string;
  cliente_id: number;
  admin_id: number;
};

export type FuncionarioAutenticado = {
  id: string;
  cpf: string | null;
  nome: string;
  email: string;
  cliente_id: number;
  admin_id: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error(
        'JWT_SECRET não foi definido no arquivo .env',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<FuncionarioAutenticado> {
    if (
      !payload.sub ||
      typeof payload.sub !== 'string'
    ) {
      throw new UnauthorizedException('Token inválido.');
    }

    const funcionario =
      await this.prisma.funcionario.findUnique({
        where: {
          id: payload.sub,
        },
      });

    if (!funcionario) {
      throw new UnauthorizedException(
        'Funcionário não encontrado.',
      );
    }

    return {
      id: funcionario.id,
      cpf: funcionario.cpf,
      nome: funcionario.nome,
      email: funcionario.email,
      cliente_id: funcionario.cliente_id,
      admin_id: funcionario.admin_id,
    };
  }
}