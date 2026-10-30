import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class FinanceiroService {
  constructor(private readonly prisma: PrismaService) {}

  async listar() {
    const contas = await this.prisma.financeiro.findMany({
      orderBy: { datacadastro: "desc" },
    });

    return contas.map((conta) => this.semSenha(conta));
  }

  async criar(dados: {
    cpf: string;
    nome: string;
    email: string;
    senha: string;
  }) {
    const cpf = dados.cpf.replace(/\D/g, "");
    const nome = dados.nome.trim();
    const email = dados.email.trim().toLowerCase();

    if (!/^\d{11}$/.test(cpf)) {
      throw new ConflictException("O CPF deve conter 11 números.");
    }

    const [funcionario, usuario, financeiro] = await Promise.all([
      this.prisma.funcionario.findFirst({
        where: { OR: [{ cpf }, { email }] },
      }),
      this.prisma.usuario.findFirst({
        where: { OR: [{ cpf }, { email }] },
      }),
      this.prisma.financeiro.findFirst({
        where: { OR: [{ cpf }, { email }] },
      }),
    ]);

    const existente = funcionario ?? usuario ?? financeiro;
    if (existente) {
      throw new ConflictException(
        existente.email === email
          ? "Já existe uma conta com este e-mail."
          : "Já existe uma conta com este CPF.",
      );
    }

    const conta = await this.prisma.financeiro.create({
      data: {
        cpf,
        nome,
        email,
        senha_hash: await bcrypt.hash(dados.senha, 10),
      },
    });

    return this.semSenha(conta);
  }

  async atualizar(
    id: number,
    dados: { nome?: string; email?: string; ativo?: boolean },
  ) {
    const existente = await this.prisma.financeiro.findUnique({
      where: { id },
    });

    if (!existente) {
      throw new NotFoundException("Conta Financeiro não encontrada.");
    }

    const email = dados.email?.trim().toLowerCase();
    if (email && email !== existente.email) {
      const [funcionario, usuario, financeiro] = await Promise.all([
        this.prisma.funcionario.findFirst({ where: { email } }),
        this.prisma.usuario.findFirst({ where: { email } }),
        this.prisma.financeiro.findFirst({
          where: { email, id: { not: id } },
        }),
      ]);

      if (funcionario || usuario || financeiro) {
        throw new ConflictException("Este e-mail já está cadastrado.");
      }
    }

    const conta = await this.prisma.financeiro.update({
      where: { id },
      data: {
        ...(dados.nome !== undefined && { nome: dados.nome.trim() }),
        ...(email !== undefined && { email }),
        ...(dados.ativo !== undefined && { ativo: dados.ativo }),
      },
    });

    return this.semSenha(conta);
  }

  remover(id: number) {
    return this.atualizar(id, { ativo: false });
  }

  private semSenha(conta: {
    id: number;
    cpf: string;
    nome: string;
    email: string;
    ativo: boolean;
    datacadastro: Date;
  }) {
    return {
      id: conta.id,
      cpf: conta.cpf,
      nome: conta.nome,
      email: conta.email,
      ativo: conta.ativo,
      datacadastro: conta.datacadastro,
      papel: "FINANCEIRO" as const,
    };
  }
}
