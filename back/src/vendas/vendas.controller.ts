import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { Papeis } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Papel, UsuarioAutenticado } from '../usuario/usuario.service';
import { AtualizarStatusVendaDto } from './dto/atualizar-status-venda.dto';
import { CriarProdutoDto } from './dto/criar-produto.dto';
import { CriarTipoProdutoDto } from './dto/criar-tipo-produto.dto';
import { CriarVendaDto } from './dto/criar-venda.dto';
import { VendasService } from './vendas.service';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@Papeis(Papel.Financeiro)
export class VendasController {
  constructor(private readonly vendas: VendasService) {}

  @Get('tipos-produto')
  listarTipos() {
    return this.vendas.listarTipos();
  }

  @Post('tipos-produto')
  criarTipo(@Body() body: CriarTipoProdutoDto) {
    return this.vendas.criarTipo(body);
  }

  @Get('produtos')
  listarProdutos() {
    return this.vendas.listarProdutos();
  }

  @Post('produtos')
  criarProduto(@Body() body: CriarProdutoDto) {
    return this.vendas.criarProduto(body);
  }

  @Get('vendas')
  listarVendas() {
    return this.vendas.listarVendas();
  }

  @Post('vendas')
  criarVenda(
    @Body() body: CriarVendaDto,
    @Req()
    request: Request & {
      user: UsuarioAutenticado;
    },
  ) {
    return this.vendas.criarVenda(body, request.user);
  }

  @Patch('vendas/:id/status')
  atualizarStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AtualizarStatusVendaDto,
  ) {
    return this.vendas.atualizarStatus(id, body.status);
  }
}
