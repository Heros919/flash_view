import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateChapas } from './dto/criar-chapa.dto';
import { ChapasService } from './chapa.service';

@Controller('chapas')
export class ChapasController {
  constructor(private readonly chapasService: ChapasService) {}

  @Post()
  criar(@Body() body: CreateChapas) {
    return this.chapasService.criarChapa(body);
  }
  @Get()
  listar() {
    return this.chapasService.listarChapas();
  }
}