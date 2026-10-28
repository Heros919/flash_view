import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  StreamableFile,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Request } from 'express';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { BlocosService } from './blocos.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import type { FuncionarioAutenticado } from '../auth/strategies/jwt.strategy';
import type { UsuarioAutenticado } from '../usuario/usuario.service';

import { Papeis } from '../auth/decorators/roles.decorator';
import { Papel } from '../usuario/usuario.service';

import { CreateBlocos } from './dto/criar-bloco.dto';
import { AtualizarBlocoDto } from './dto/atualizar-bloco.dto';

import {
  CAMPO_IMAGEM,
  CAMPO_IMAGENS,
  MAX_IMAGENS,
  opcoesUploadImagem,
} from '../common/upload-imagem.options';
import type { ArquivoImagem } from '../common/upload-imagem.options';

@Controller('blocos')
export class BlocosController {
  constructor(private readonly blocosService: BlocosService) {}

  @Papeis(Papel.Funcionario, Papel.Financeiro)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  criar(
    @Body() body: CreateBlocos,
    @Req()
    request: Request & {
      user: FuncionarioAutenticado | UsuarioAutenticado;
    },
  ) {
    return this.blocosService.criarBloco(body, request.user);
  }

  @Get()
  listar() {
    return this.blocosService.listas();
  }

  @Get(':id/imagem')
  async imagem(@Param('id') id: string) {
    const midia = await this.blocosService.buscarImagem(id);

    return new StreamableFile(Buffer.from(midia.dados), {
      type: midia.formato,
      disposition: `inline; filename="${encodeURIComponent(midia.nome)}"`,
    });
  }

  @Get(':id/imagens')
  listarImagens(@Param('id') id: string) {
    return this.blocosService.listarImagens(id);
  }

  @Get(':id/imagens/:midiaId')
  async imagemPorId(
    @Param('id') id: string,
    @Param('midiaId') midiaId: string,
  ) {
    const midia = await this.blocosService.buscarImagemPorId(id, midiaId);

    return new StreamableFile(Buffer.from(midia.dados), {
      type: midia.formato,
      disposition: `inline; filename="${encodeURIComponent(midia.nome)}"`,
    });
  }

  @Papeis(Papel.Funcionario, Papel.Financeiro)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':id/imagens')
  @UseInterceptors(
    FilesInterceptor(CAMPO_IMAGENS, MAX_IMAGENS, opcoesUploadImagem),
  )
  async enviarImagens(
    @Param('id') id: string,
    @UploadedFiles() arquivos: ArquivoImagem[],
  ) {
    if (!arquivos || arquivos.length === 0) {
      throw new BadRequestException(
        `Nenhuma imagem foi enviada (campo "${CAMPO_IMAGENS}").`,
      );
    }

    return this.blocosService.adicionarImagens(id, arquivos);
  }

  @Papeis(Papel.Funcionario, Papel.Financeiro)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id/imagens/:midiaId')
  excluirImagem(@Param('id') id: string, @Param('midiaId') midiaId: string) {
    return this.blocosService.excluirImagem(id, midiaId);
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.blocosService.buscarPorId(id);
  }

  @Papeis(Papel.Funcionario, Papel.Financeiro)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() body: AtualizarBlocoDto) {
    return this.blocosService.atualizarBloco(id, body);
  }

  @Papeis(Papel.Funcionario, Papel.Financeiro)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  excluir(@Param('id') id: string) {
    return this.blocosService.excluirBloco(id);
  }

  @Papeis(Papel.Funcionario, Papel.Financeiro)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':id/imagem')
  @UseInterceptors(FileInterceptor(CAMPO_IMAGEM, opcoesUploadImagem))
  async enviarImagem(
    @Param('id') id: string,
    @UploadedFile() arquivo: ArquivoImagem,
  ) {
    if (!arquivo) {
      throw new BadRequestException(
        `Nenhuma imagem foi enviada (campo "${CAMPO_IMAGEM}").`,
      );
    }

    return this.blocosService.salvarImagem(id, arquivo);
  }
}
