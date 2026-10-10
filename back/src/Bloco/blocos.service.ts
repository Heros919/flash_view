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
import { MAX_IMAGENS } from '../common/upload-imagem.options';
import { erroAoGravarImagem } from '../common/erro-imagem';


@Injectable()
export class BlocosService {
  constructor(private readonly prisma: PrismaService) { }


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


  async listas() {
    return this.prisma.bloco.findMany({
      orderBy: {
        datacadastro: 'desc',
      },

      include: {
        midia: {
          select: { id: true },
          take: 1,
        },
      },
    });
  }



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


  async excluirBloco(id: string) {
    const bloco = await this.prisma.bloco.findUnique({
      where: {
        id,
      },

      include: {
        _count: {
          select: { chapa: true },
        },
      },
    });

    if (!bloco) {
      throw new NotFoundException('Bloco não encontrado');
    }

    if (bloco._count.chapa > 0) {
      throw new ConflictException(
        `Não é possível excluir o bloco ${bloco.codigo}: ele possui ${bloco._count.chapa} chapa(s) cadastrada(s). Exclua as chapas primeiro.`,
      );
    }

    try {
      await this.prisma.bloco.delete({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException('Bloco não encontrado');
        }

        if (e.code === 'P2003') {
          throw new ConflictException(
            'Não é possível excluir: o bloco está vinculado a outros registros.',
          );
        }
      }

      throw e;
    }

    return {
      id,
      mensagem: 'Bloco excluído com sucesso',
    };
  }


  async listarImagens(id: string) {
    const bloco = await this.prisma.bloco.findUnique({
      where: {
        id,
      },
    });

    if (!bloco) {
      throw new NotFoundException('Bloco não encontrado');
    }

    return this.prisma.midia.findMany({
      where: {
        blocoid: id,
      },

      orderBy: [{ datacadastro: 'asc' }, { nome: 'asc' }],

      select: {
        id: true,
        nome: true,
        tipo: true,
        formato: true,
      },
    });
  }

  async buscarImagemPorId(id: string, midiaId: string) {
    const midia = await this.prisma.midia.findFirst({
      where: {
        id: midiaId,
        blocoid: id,
      },
    });

    if (!midia) {
      throw new NotFoundException('Imagem não encontrada');
    }

    return midia;
  }

  async adicionarImagens(id: string, arquivos: ArquivoImagem[]) {
    const bloco = await this.prisma.bloco.findUnique({
      where: {
        id,
      },
    });

    if (!bloco) {
      throw new NotFoundException('Bloco não encontrado');
    }

    try {
      return await this.prisma.$transaction(
        async (transaction) => {
          const quantidadeAtual = await transaction.midia.count({
            where: {
              blocoid: id,
            },
          });
          if (quantidadeAtual + arquivos.length > MAX_IMAGENS) {
            throw new ConflictException(
              `Um bloco pode ter no máximo ${MAX_IMAGENS} imagens. Ele já possui ${quantidadeAtual}.`,
            );
          }

          return Promise.all(
            arquivos.map((arquivo) =>
              transaction.midia.create({
                data: {
                  id: randomUUID(),
                  nome: arquivo.originalname,
                  tipo: 'FOTO',
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
            ),
          );
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2034'
      ) {
        throw new ConflictException(
          'O limite de imagens foi atingido por outro envio. Atualize a lista e tente novamente.',
        );
      }

      return erroAoGravarImagem(e);
    }
  }

  async excluirImagem(id: string, midiaId: string) {
    const resultado = await this.prisma.midia.deleteMany({
      where: {
        id: midiaId,
        blocoid: id,
      },
    });

    if (resultado.count === 0) {
      throw new NotFoundException('Imagem não encontrada');
    }

    return {
      id: midiaId,
      mensagem: 'Imagem excluída com sucesso',
    };
  }

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


  async salvarImagem(id: string, arquivo: ArquivoImagem) {
    const bloco = await this.prisma.bloco.findUnique({
      where: {
        id,
      },
    });

    if (!bloco) {
      throw new NotFoundException('Bloco não encontrado');
    }


    try {
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
            tipo: 'FOTO',
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
    } catch (e) {
      return erroAoGravarImagem(e);
    }
  }
}