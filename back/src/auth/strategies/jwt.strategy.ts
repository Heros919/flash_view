import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { PrismaService } from "../../prisma/prisma.service";
import { PapelConta } from "../../generated/prisma/enums";
import { UsuarioAutenticado } from "../../usuario/usuario.service";

type JwtPayload = {
  sub: string;
  email: string;
  tipoConta?: "usuario" | "financeiro" | "funcionario";
  papel?: PapelConta;
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
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const secret = config.get<string>("JWT_SECRET")?.trim();

    if (!secret) {
      throw new Error("JWT_SECRET não foi definido no arquivo .env");
    }

    if (secret.length < 32) {
      throw new Error("JWT_SECRET deve ter pelo menos 32 caracteres.");
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      algorithms: ["HS256"], // 3.3
    });
  }

  async validate(
    payload: JwtPayload,
  ): Promise<FuncionarioAutenticado | UsuarioAutenticado> {
    if (!payload.sub || typeof payload.sub !== "string") {
      throw new UnauthorizedException("Token inválido.");
    }

    // 3.3: seleção estrita por tipoConta, SEM fallback entre tabelas
    switch (payload.tipoConta) {
      case "usuario":
        return this.buscarUsuarioAutenticado(payload.sub);

      case "financeiro":
        return this.buscarFinanceiroAutenticado(payload.sub);

      case "funcionario":
      default:
        // Tokens legados sem tipoConta caem aqui (compatibilidade).
        return this.buscarFuncionarioAutenticado(payload.sub);
    }
  }

  private async buscarUsuarioAutenticado(
    sub: string,
  ): Promise<UsuarioAutenticado> {
    const id = this.parseNumericId(sub);

    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario || !usuario.ativo) {
      throw new UnauthorizedException("Conta não encontrada ou inativa.");
    }

    return {
      id: usuario.id,
      cpf: usuario.cpf,
      nome: usuario.nome,
      email: usuario.email,
      ativo: usuario.ativo,
      papel: usuario.papel,
    };
  }

  private async buscarFinanceiroAutenticado(
    sub: string,
  ): Promise<UsuarioAutenticado> {
    const id = this.parseNumericId(sub);

    const financeiro = await this.prisma.financeiro.findUnique({
      where: { id },
    });

    if (!financeiro || !financeiro.ativo) {
      throw new UnauthorizedException("Conta não encontrada ou inativa.");
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

  private async buscarFuncionarioAutenticado(
    sub: string,
  ): Promise<FuncionarioAutenticado> {
    const funcionario = await this.prisma.funcionario.findUnique({
      where: { id: sub },
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

  private parseNumericId(sub: string): number {
    const id = Number(sub);
    if (!Number.isSafeInteger(id) || String(id) !== sub) {
      throw new UnauthorizedException("Token inválido.");
    }
    return id;
  }
}