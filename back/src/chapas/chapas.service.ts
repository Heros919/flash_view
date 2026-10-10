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
import { AtualizarChapaDto } from './dto/atualizar-chapa.dto';
import type { ArquivoImagem } from '../common/upload-imagem.options';
import { erroAoGravarImagem } from '../common/erro-imagem';
import { MAX_IMAGENS } from '../common/upload-imagem.options';

const incluirBlocoEMidia = {
  bloco: {
    select: {
      id: true,
      codigo: true,
      material: true,
      cor: true,
      comprimento: true,
      altura: true,
      largura: true
    }
  },
  midia: { select: { id: true }, take: 1 }
} satisfies Prisma.chapaInclude;

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
    return this.prisma.chapa.findMany({
      orderBy: { datacadastro: 'desc' },
      include: incluirBlocoEMidia
    });
  }

  async buscarPorId(id: string) {
    const chapa = await this.prisma.chapa.findUnique({
      where: { id },
      include: incluirBlocoEMidia
    });

    if (!chapa) {
      throw new NotFoundException('Chapa não encontrada');
    }

    return chapa;
  }

  async atualizarChapa(id: string, dados: AtualizarChapaDto) {
    try {
      return await this.prisma.chapa.update({
        where: { id },
        data: {
          ...(dados.codigo !== undefined && { codigo: dados.codigo }),
          ...(dados.espessura !== undefined && { espessura: dados.espessura }),
          ...(dados.altura !== undefined && { altura: dados.altura }),
          ...(dados.largura !== undefined && { largura: dados.largura }),
          ...(dados.acabamento !== undefined && {
            acabamento: dados.acabamento
          })
        }
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException('Chapa não encontrada');
        }
        if (e.code === 'P2002') {
          throw new ConflictException('Já existe uma chapa com esse código');
        }
      }
      throw e;
    }
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

  async excluirChapa(id: string) {
    try {
      await this.prisma.chapa.delete({ where: { id } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException('Chapa não encontrada');
        }
        if (e.code === 'P2003') {
          throw new ConflictException(
            'Não é possível excluir: a chapa está vinculada a outros registros.'
          );
        }
      }
      throw e;
    }

    return { id, mensagem: 'Chapa excluída com sucesso' };
  }

  async buscarImagem(id: string) {
    const chapa = await this.prisma.chapa.findUnique({ where: { id } });
    if (!chapa) {
      throw new NotFoundException('Chapa não encontrada');
    }

    const midia = await this.prisma.midia.findFirst({
      where: { chapaid: id },
      orderBy: { datacadastro: 'desc' }
    });
    if (!midia) {
      throw new NotFoundException('Imagem da chapa não encontrada');
    }

    return midia;
  }

  async listarImagens(id: string) {
    const chapa = await this.prisma.chapa.findUnique({ where: { id } });
    if (!chapa) {
      throw new NotFoundException('Chapa não encontrada');
    }

    return this.prisma.midia.findMany({
      where: { chapaid: id },
      orderBy: [{ datacadastro: 'asc' }, { nome: 'asc' }],
      select: {
        id: true,
        nome: true,
        tipo: true,
        formato: true
      }
    });
  }

  async buscarImagemPorId(id: string, midiaId: string) {
    const midia = await this.prisma.midia.findFirst({
      where: {
        id: midiaId,
        chapaid: id
      }
    });

    if (!midia) {
      throw new NotFoundException('Imagem não encontrada');
    }

    return midia;
  }

  async adicionarImagens(id: string, arquivos: ArquivoImagem[]) {
    const chapa = await this.prisma.chapa.findUnique({ where: { id } });
    if (!chapa) {
      throw new NotFoundException('Chapa não encontrada');
    }

    try {
      return await this.prisma.$transaction(
        async (transaction) => {
          const quantidadeAtual = await transaction.midia.count({
            where: { chapaid: id }
          });
          if (quantidadeAtual + arquivos.length > MAX_IMAGENS) {
            throw new ConflictException(
              `Uma chapa pode ter no máximo ${MAX_IMAGENS} imagens. Ela já possui ${quantidadeAtual}.`
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
                  chapaid: id
                },
                select: {
                  id: true,
                  nome: true,
                  tipo: true,
                  formato: true,
                  chapaid: true
                }
              })
            )
          );
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
      );
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2034'
      ) {
        throw new ConflictException(
          'O limite de imagens foi atingido por outro envio. Atualize a lista e tente novamente.'
        );
      }

      return erroAoGravarImagem(e);
    }
  }

  async excluirImagem(id: string, midiaId: string) {
    const resultado = await this.prisma.midia.deleteMany({
      where: {
        id: midiaId,
        chapaid: id
      }
    });

    if (resultado.count === 0) {
      throw new NotFoundException('Imagem não encontrada');
    }

    return {
      id: midiaId,
      mensagem: 'Imagem excluída com sucesso'
    };
  }

  async salvarImagem(id: string, arquivo: ArquivoImagem) {
    const chapa = await this.prisma.chapa.findUnique({ where: { id } });
    if (!chapa) {
      throw new NotFoundException('Chapa não encontrada');
    }

    try {
      const [, midia] = await this.prisma.$transaction([
        this.prisma.midia.deleteMany({ where: { chapaid: id } }),
        this.prisma.midia.create({
          data: {
            id: randomUUID(),
            nome: arquivo.originalname,
            tipo: 'FOTO',
            formato: arquivo.mimetype,
            dados: new Uint8Array(arquivo.buffer),
            chapaid: id
          },
          select: {
            id: true,
            nome: true,
            tipo: true,
            formato: true,
            chapaid: true
          }
        })
      ]);

      return midia;
    } catch (e) {
      return erroAoGravarImagem(e);
    }
  }
}