import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { PrismaService } from "../../prisma/prisma.service";
import { PapelConta } from "../../generated/prisma/enums";
import { UsuarioAutenticado } from "../../usuario/usuario.service";

type JwtPayload = {
  sub: string;
  email: string;
  tipoConta?: "usuario" | "financeiro" | "funcionario";
  papel?: string;
  cliente_id?: number;
  admin_id?: number;
};

export type FuncionarioAutenticado = {
  id: string;
  cpf: string | null;
  nome: string;
  email: string;
  cliente_id: number;
  admin_id: number;
  papel: "FUNCIONARIO";
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET não foi definido no arquivo .env");
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(
    payload: JwtPayload,
  ): Promise<FuncionarioAutenticado | UsuarioAutenticado> {
    if (!payload.sub || typeof payload.sub !== "string") {
      throw new UnauthorizedException("Token inválido.");
    }

    if (payload.tipoConta === "usuario" || payload.tipoConta === "financeiro") {
      const id = Number(payload.sub);

      if (!Number.isSafeInteger(id) || String(id) !== payload.sub) {
        throw new UnauthorizedException("Token inválido.");
      }

      if (payload.tipoConta === "financeiro") {
        return this.buscarFinanceiroAutenticado(id);
      }

      const usuario = await this.prisma.usuario.findUnique({
        where: { id },
      });

      if (usuario?.ativo) {
        return {
          id: usuario.id,
          cpf: usuario.cpf,
          nome: usuario.nome,
          email: usuario.email,
          ativo: usuario.ativo,
          papel: usuario.papel,
        };
      }

      return this.buscarFinanceiroAutenticado(id);
    }

    const funcionario = await this.prisma.funcionario.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!funcionario) {
      throw new UnauthorizedException("Funcionário não encontrado.");
    }

    return {
      id: funcionario.id,
      cpf: funcionario.cpf,
      nome: funcionario.nome,
      email: funcionario.email,
      cliente_id: funcionario.cliente_id,
      admin_id: funcionario.admin_id,
      papel: PapelConta.FUNCIONARIO,
    };
  }

  private async buscarFinanceiroAutenticado(
    id: number,
  ): Promise<UsuarioAutenticado> {
    const financeiro = await this.prisma.financeiro.findUnique({
      where: { id },
    });

    if (!financeiro || !financeiro.ativo) {
      throw new UnauthorizedException("Conta Financeiro não encontrada.");
    }

    return {
      id: financeiro.id,
      cpf: financeiro.cpf,
      nome: financeiro.nome,
      email: financeiro.email,
      ativo: financeiro.ativo,
      papel: PapelConta.FINANCEIRO,
    };
  }
}
