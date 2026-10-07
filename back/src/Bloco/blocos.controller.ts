import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { BlocosService } from './blocos.service';

import { Papeis } from '../auth/decorators/roles.decorator';
import { Papel } from '../usuario/usuario.service';

import { CreateBlocos } from './dto/criar-bloco.dto';
import { AtualizarBlocoDto } from './dto/atualizar-bloco.dto';

import {
  CAMPO_IMAGEM,
  opcoesUploadImagem,
} from '../common/upload-imagem.options';
import type { ArquivoImagem } from '../common/upload-imagem.options';

@Controller('blocos')
export class BlocosController {
  constructor(private readonly blocosService: BlocosService) {}

  @Papeis(Papel.Funcionario)
  @Post()
  criar(@Body() body: CreateBlocos) {
    return this.blocosService.criarBloco(body);
  }

  @Get()
  listar() {
    return this.blocosService.listas();
  }

  // Precisa vir ANTES de ':id'
  @Get(':id/imagem')
  async imagem(@Param('id') id: string) {
    const midia = await this.blocosService.buscarImagem(id);

    return new StreamableFile(Buffer.from(midia.dados), {
      type: midia.formato,
      disposition: `inline; filename="${encodeURIComponent(midia.nome)}"`,
    });
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.blocosService.buscarPorId(id);
  }

  @Papeis(Papel.Funcionario)
  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() body: AtualizarBlocoDto) {
    return this.blocosService.atualizarBloco(id, body);
  }

  @Papeis(Papel.Funcionario)
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