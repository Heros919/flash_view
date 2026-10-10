import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  StreamableFile,
  UploadedFile,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ChapasService } from './chapas.service';
import { Papeis } from '../auth/decorators/roles.decorator';
import { CreatChapas } from './dto/criar-chapas.dto';
import { AutualizarStatus } from './dto/autera-status.dto';
import { AtualizarChapaDto } from './dto/atualizar-chapa.dto';
import { Papel } from '../usuario/usuario.service';
import {
  CAMPO_IMAGEM,
  CAMPO_IMAGENS,
  MAX_IMAGENS,
  opcoesUploadImagem
} from '../common/upload-imagem.options';
import type { ArquivoImagem } from '../common/upload-imagem.options';
 
@Controller('chapas')
export class ChapasController {
  constructor(private readonly chapasservice: ChapasService) {}
 
  @Papeis(Papel.Funcionario)
  @Post()
  criar(@Body() body: CreatChapas) {
    return this.chapasservice.criarChapas(body);
  }
 
  @Get()
  listar() {
    return this.chapasservice.listar();
  }
 
 
  @Get(':id/imagem')
  async imagem(@Param('id') id: string) {
    const midia = await this.chapasservice.buscarImagem(id);
 
    return new StreamableFile(Buffer.from(midia.dados), {
      type: midia.formato,
      disposition: `inline; filename="${encodeURIComponent(midia.nome)}"`
    });
  }

  @Get(':id/imagens')
  listarImagens(@Param('id') id: string) {
    return this.chapasservice.listarImagens(id);
  }

  @Get(':id/imagens/:midiaId')
  async imagemPorId(
    @Param('id') id: string,
    @Param('midiaId') midiaId: string
  ) {
    const midia = await this.chapasservice.buscarImagemPorId(id, midiaId);

    return new StreamableFile(Buffer.from(midia.dados), {
      type: midia.formato,
      disposition: `inline; filename="${encodeURIComponent(midia.nome)}"`
    });
  }

  @Papeis(Papel.Funcionario)
  @Post(':id/imagens')
  @UseInterceptors(
    FilesInterceptor(CAMPO_IMAGENS, MAX_IMAGENS, opcoesUploadImagem)
  )
  async enviarImagens(
    @Param('id') id: string,
    @UploadedFiles() arquivos: ArquivoImagem[]
  ) {
    if (!arquivos || arquivos.length === 0) {
      throw new BadRequestException(
        `Nenhuma imagem foi enviada (campo "${CAMPO_IMAGENS}").`
      );
    }

    return this.chapasservice.adicionarImagens(id, arquivos);
  }

  @Papeis(Papel.Funcionario)
  @Delete(':id/imagens/:midiaId')
  excluirImagem(
    @Param('id') id: string,
    @Param('midiaId') midiaId: string
  ) {
    return this.chapasservice.excluirImagem(id, midiaId);
  }
 
  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.chapasservice.buscarPorId(id);
  }
 
  @Papeis(Papel.Funcionario)
  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() body: AtualizarChapaDto) {
    return this.chapasservice.atualizarChapa(id, body);
  }
 
  @Papeis(Papel.Financeiro)
  @Patch(':id/status')
  atualizarStatus(@Param('id') id: string, @Body() dto: AutualizarStatus) {
    return this.chapasservice.atualizarStatus(id, dto);
  }
 @Papeis(Papel.Funcionario)
  @Delete(':id')
  excluir(@Param('id') id: string) {
    return this.chapasservice.excluirChapa(id);
  }
 
  @Papeis(Papel.Funcionario)
  @Post(':id/imagem')
  @UseInterceptors(FileInterceptor(CAMPO_IMAGEM, opcoesUploadImagem))
  async enviarImagem(
    @Param('id') id: string,
    @UploadedFile() arquivo: ArquivoImagem
  ) {
    if (!arquivo) {
      throw new BadRequestException(
        `Nenhuma imagem foi enviada (campo "${CAMPO_IMAGEM}").`
      );
    }
 
    return this.chapasservice.salvarImagem(id, arquivo);
  }
}