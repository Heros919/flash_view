import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { UsuarioAutenticado } from '../usuario/usuario.service';
import { CriarProdutoDto } from './dto/criar-produto.dto';
import { CriarTipoProdutoDto } from './dto/criar-tipo-produto.dto';
import { CriarVendaDto } from './dto/criar-venda.dto';

@Injectable()
export class VendasService {
  constructor(private readonly prisma: PrismaService) {}

  listarTipos() {
    return this.prisma.tipo_produto.findMany({
      orderBy: { nome: 'asc' },
    });
  }

  async criarTipo(dados: CriarTipoProdutoDto) {
    try {
      return await this.prisma.tipo_produto.create({
        data: { nome: dados.nome.trim() },
      });
    } catch (erro) {
      if (
        erro instanceof Prisma.PrismaClientKnownRequestError &&
        erro.code === 'P2002'
      ) {
        throw new ConflictException('Esse tipo de produto já existe.');
      }

      throw erro;
    }
  }

  async criarProduto(dados: CriarProdutoDto) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: dados.clienteId },
    });
    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado.');
    }

    const tipo = await this.prisma.tipo_produto.findUnique({
      where: { id: dados.tipoId },
    });
    if (!tipo) {
      throw new NotFoundException('Tipo de produto não encontrado.');
    }

    return this.prisma.produto_servico.create({
      data: {
        cliente_id: dados.clienteId,
        tipo_id: dados.tipoId,
        nome: dados.nome.trim(),
        ...(dados.descricao !== undefined && {
          descricao: dados.descricao.trim(),
        }),
        preco: dados.preco,
      },
      include: { tipo_produto: true },
    });
  }

  listarProdutos() {
    return this.prisma.produto_servico.findMany({
      where: { ativo: true },
      include: { tipo_produto: true, cliente: true },
      orderBy: { nome: 'asc' },
    });
  }

  listarVendas() {
    return this.prisma.venda.findMany({
      include: {
        cliente: true,
        venda_item: {
          include: { produto_servico: true },
        },
      },
      orderBy: { datavenda: 'desc' },
    });
  }

  async criarVenda(dados: CriarVendaDto, usuario: UsuarioAutenticado) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: dados.clienteId },
    });
    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado.');
    }

    const idsProduto = dados.itens.map((item) => item.produtoServicoId);
    const produtos = await this.prisma.produto_servico.findMany({
      where: {
        id: { in: idsProduto },
        cliente_id: dados.clienteId,
        ativo: true,
      },
    });
    if (produtos.length !== idsProduto.length) {
      throw new NotFoundException(
        'Um ou mais produtos não pertencem ao cliente ou estão inativos.',
      );
    }

    const produtosPorId = new Map(
      produtos.map((produto) => [produto.id, produto]),
    );
    const itens = dados.itens.map((item) => {
      const produto = produtosPorId.get(item.produtoServicoId);
      if (!produto) {
        throw new NotFoundException('Produto não encontrado.');
      }

      return {
        cliente_id: dados.clienteId,
        produto_servico_id: produto.id,
        quantidade: item.quantidade,
        preco_unitario: produto.preco,
        subtotal: new Prisma.Decimal(produto.preco.toString())
          .mul(item.quantidade)
          .toDecimalPlaces(2),
      };
    });

    const total = itens.reduce(
      (soma, item) => soma.add(item.subtotal),
      new Prisma.Decimal(0),
    );

    return this.prisma.venda.create({
      data: {
        cliente_id: dados.clienteId,
        usuario_id: usuario.id,
        total,
        venda_item: { create: itens },
      },
      include: {
        cliente: true,
        venda_item: {
          include: { produto_servico: true },
        },
      },
    });
  }

  async atualizarStatus(id: number, status: string) {
    const venda = await this.prisma.venda.findUnique({
      where: { id },
    });
    if (!venda) {
      throw new NotFoundException('Pedido não encontrado.');
    }

    return this.prisma.venda.update({
      where: { id },
      data: { status },
    });
  }
}
