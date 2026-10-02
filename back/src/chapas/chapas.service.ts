import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatChapas } from './dto/criar-chapas.dto';
import { AutualizarStatus } from './dto/autera-status.dto';

@Injectable()
export class ChapasService {
  constructor(private readonly prisma: PrismaService) {}

  async criarChapas(dados: CreatChapas) {
    const funcionario = await this.prisma.funcionario.findUnique({
      where: { id: dados.funcionarioId }
    });
    if (!funcionario) {
      throw new NotFoundException('Funcionário não encontrado');
    }

    const bloco = await this.prisma.bloco.findUnique({
      where: { id: dados.blocoId }
    });
    if (!bloco) {
      throw new NotFoundException('Bloco não encontrado');
    }

    try {
      return await this.prisma.chapa.create({
        data: {
          id: randomUUID(),
          cliente_id: funcionario.cliente_id,
          funcionario_id: funcionario.id,
          blocoid: bloco.id,
          codigo: dados.codigo,
          espessura: dados.espessura,
          altura: dados.altura,
          largura: dados.largura,
          acabamento: dados.acabamento,
          status: dados.status
        }
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('Já existe uma chapa com esse código');
      }
      throw e;
    }
  }

  listar() {
    return this.prisma.chapa.findMany({ orderBy: { datacadastro: 'desc' } });
  }

  async atualizarStatus(id: string, dto: AutualizarStatus) {
    try {
      return await this.prisma.chapa.update({
        where: { id },
        data: { status: dto.status }
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException('Chapa não encontrada');
      }
      throw e;
    }
  }
}