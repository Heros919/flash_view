import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { randomUUID } from 'crypto';

import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

import { CreateBlocos } from './dto/criar-bloco.dto';
import { AtualizarBlocoDto } from './dto/atualizar-bloco.dto';

import type { ArquivoImagem } from '../common/upload-imagem.options';

@Injectable()
export class BlocosService {
  constructor(private readonly prisma: PrismaService) {}

  // ==========================================================
  // CRIAR BLOCO
  // ==========================================================

  async criarBloco(dados: CreateBlocos) {
    const funcionario = await this.prisma.funcionario.findUnique({
      where: {
        id: dados.funcionarioId,
      },
    });

    if (!funcionario) {
      throw new NotFoundException('Funcionário não encontrado');
    }

    try {
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
          frente: dados.frente,
        },
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

  // ==========================================================
  // LISTAR BLOCOS
  // ==========================================================

  async listas() {
    return this.prisma.bloco.findMany({
      orderBy: {
        datacadastro: 'desc',
      },

      // Só o id da mídia (sem os bytes) para o front saber se há imagem.
      include: {
        midia: {
          select: { id: true },
          take: 1,
        },
      },
    });
  }

  // ==========================================================
  // BUSCAR BLOCO POR ID
  // ==========================================================

  async buscarPorId(id: string) {
    const bloco = await this.prisma.bloco.findUnique({
      where: {
        id,
      },
    });

    if (!bloco) {
      throw new NotFoundException('Bloco não encontrado');
    }

    return bloco;
  }

  // ==========================================================
  // ATUALIZAR BLOCO
  // ==========================================================

  async atualizarBloco(id: string, dados: AtualizarBlocoDto) {
    const bloco = await this.prisma.bloco.findUnique({
      where: {
        id,
      },
    });

    if (!bloco) {
      throw new NotFoundException('Bloco não encontrado');
    }

    try {
      return await this.prisma.bloco.update({
        where: {
          id,
        },

        data: {
          ...(dados.codigo !== undefined && { codigo: dados.codigo }),
          ...(dados.numero !== undefined && { numero: dados.numero }),
          ...(dados.material !== undefined && { material: dados.material }),
          ...(dados.cor !== undefined && { cor: dados.cor }),
          ...(dados.altura !== undefined && { altura: dados.altura }),
          ...(dados.largura !== undefined && { largura: dados.largura }),
          ...(dados.comprimento !== undefined && {
            comprimento: dados.comprimento,
          }),
          ...(dados.peso !== undefined && { peso: dados.peso }),
          ...(dados.mes !== undefined && { mes: dados.mes }),
          ...(dados.ano !== undefined && { ano: dados.ano }),
          ...(dados.frente !== undefined && { frente: dados.frente }),
        },
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

  // ==========================================================
  // BUSCAR IMAGEM DO BLOCO
  // ==========================================================

  async buscarImagem(id: string) {
    const bloco = await this.prisma.bloco.findUnique({
      where: {
        id,
      },
    });

    if (!bloco) {
      throw new NotFoundException('Bloco não encontrado');
    }

    const midia = await this.prisma.midia.findFirst({
      where: {
        blocoid: id,
      },

      orderBy: {
        datacadastro: 'desc',
      },
    });

    if (!midia) {
      throw new NotFoundException('Imagem do bloco não encontrada');
    }

    return midia;
  }

  // ==========================================================
  // SALVAR / SUBSTITUIR IMAGEM
  // ==========================================================

  async salvarImagem(id: string, arquivo: ArquivoImagem) {
    const bloco = await this.prisma.bloco.findUnique({
      where: {
        id,
      },
    });

    if (!bloco) {
      throw new NotFoundException('Bloco não encontrado');
    }

    // Troca a imagem anterior pela nova de forma atômica.
    // O select evita devolver o campo "dados" (bytes) na resposta JSON.
    const [, midia] = await this.prisma.$transaction([
      this.prisma.midia.deleteMany({
        where: {
          blocoid: id,
        },
      }),

      this.prisma.midia.create({
        data: {
          id: randomUUID(),
          nome: arquivo.originalname,
          tipo: 'IMAGEM',
          formato: arquivo.mimetype,
          dados: new Uint8Array(arquivo.buffer),
          blocoid: id,
        },

        select: {
          id: true,
          nome: true,
          tipo: true,
          formato: true,
          blocoid: true,
        },
      }),
    ]);

    return midia;
  }
}