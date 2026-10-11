import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { PapelConta } from '../generated/prisma/enums';

export const Papel = {
  Funcionario: 'FUNCIONARIO',
  Administrador: 'ADMINISTRADOR',
  Financeiro: 'FINANCEIRO',
} as const;

export type Papel =
  (typeof Papel)[keyof typeof Papel];

export type UsuarioAutenticado = {
  id: number;
  cpf: string;
  nome: string;
  email: string;
  ativo: boolean;
  papel: Papel;
};

@Injectable()
export class UsuarioService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async buscarPorId(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id },
    });
  }

  async buscarPorCpf(cpf: string) {
    return this.prisma.usuario.findUnique({
      where: { cpf },
    });
  }

  async buscarPorEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  async listar() {
    const usuarios = await this.prisma.usuario.findMany({
      orderBy: { datacadastro: 'desc' },
    });

    return usuarios.map((usuario) => this.semSenha(usuario));
  }

  async criar(dados: {
    cpf: string;
    nome: string;
    email: string;
    senha: string;
    papel?: PapelConta;
  }): Promise<UsuarioAutenticado> {
    const cpf = dados.cpf.replace(/\D/g, '');
    const email = dados.email.trim().toLowerCase();

    if (!/^\d{11}$/.test(cpf)) {
      throw new ConflictException(
        'O CPF deve conter 11 números.',
      );
    }

    const existente = await this.prisma.usuario.findFirst({
      where: {
        OR: [{ cpf }, { email }],
      },
    });

    if (existente) {
      if (existente.cpf === cpf) {
        throw new ConflictException(
          'Já existe um usuário cadastrado com este CPF.',
        );
      }

      throw new ConflictException(
        'Já existe um usuário cadastrado com este e-mail.',
      );
    }

    const senha_hash = await bcrypt.hash(dados.senha, 10);

    const usuario = await this.prisma.usuario.create({
      data: {
        cpf,
        nome: dados.nome.trim(),
        email,
        senha_hash,
        papel: PapelConta.FUNCIONARIO,
      },
    });

    return this.semSenha(usuario);
  }

  async atualizar(
    id: number,
    dados: {
      nome?: string;
      email?: string;
      ativo?: boolean;
    },
  ): Promise<UsuarioAutenticado> {
    const existente = await this.buscarPorId(id);

    if (!existente) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const email = dados.email?.trim().toLowerCase();

    if (email && email !== existente.email) {
      const emailExistente = await this.buscarPorEmail(email);

      if (emailExistente) {
        throw new ConflictException(
          'Este e-mail já está cadastrado.',
        );
      }
    }

    const usuario = await this.prisma.usuario.update({
      where: { id },
      data: {
        ...(dados.nome !== undefined && {
          nome: dados.nome.trim(),
        }),
        ...(email !== undefined && { email }),
        ...(dados.ativo !== undefined && {
          ativo: dados.ativo,
        }),
      },
    });

    return this.semSenha(usuario);
  }

  async remover(id: number): Promise<UsuarioAutenticado> {
    const existente = await this.buscarPorId(id);

    if (!existente) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const usuario = await this.prisma.usuario.delete({
      where: { id },
    });

    return this.semSenha(usuario);
  }

  semSenha(usuario: {
    id: number;
    cpf: string;
    nome: string;
    email: string;
    ativo: boolean;
    papel: PapelConta;
  }): UsuarioAutenticado {
    return {
      id: usuario.id,
      cpf: usuario.cpf,
      nome: usuario.nome,
      email: usuario.email,
      ativo: usuario.ativo,
      papel: usuario.papel,
    };
  }
}