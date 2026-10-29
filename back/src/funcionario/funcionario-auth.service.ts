import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FuncionarioAuthService {
  constructor(private readonly prisma: PrismaService) {}

  async buscarPorEmail(email: string) {
    return this.prisma.funcionario.findUnique({
      where: {
        email: email.trim().toLowerCase(),
      },
    });
  }

  async validarCredenciais(email: string, senha: string) {
    const funcionario = await this.buscarPorEmail(email);

    if (!funcionario) {
      return null;
    }

    const senhaValida = await bcrypt.compare(
      senha,
      funcionario.senha,
    );

    if (!senhaValida) {
      return null;
    }

    return {
      id: funcionario.id,
      nome: funcionario.nome,
      email: funcionario.email,
      cliente_id: funcionario.cliente_id,
      admin_id: funcionario.admin_id,
    };
  }
}
