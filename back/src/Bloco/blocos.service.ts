import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlocos } from './dto/criar-bloco.dto';

@Injectable()
export class BlocosService {
  constructor(private readonly prisma: PrismaService) {}

  async criarBloco(dados: CreateBlocos) {
    const funcionario = await this.prisma.funcionario.findUnique({
      where: { id: dados.funcionarioId }
    });
    if (!funcionario) {
      throw new NotFoundException('Funcionário não encontrado');
    }

    try {
      // volume e datacadastro são preenchidos pelo próprio banco: não enviar
      return await this.prisma.bloco.create({
        data: {
          id: randomUUID(),
          cliente_id: funcionario.cliente_id,
          funcionario_id: funcionario.id,
          codigo: dados.codigo,
          numero: dados.numero,
          material: dados.material,
          cor: dados.cor,
          altura: dados.altura,
          largura: dados.largura,
          comprimento: dados.comprimento,
          peso: dados.peso,
          mes: dados.mes,
          ano: dados.ano,
          frente: dados.frente
        }
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('Já existe um bloco com esse código');
      }
      throw e;
    }
  }

  listas() {
    return this.prisma.bloco.findMany({ orderBy: { datacadastro: 'desc' } });
  }
}