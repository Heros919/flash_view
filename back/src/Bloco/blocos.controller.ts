import { BlocosService } from './blocos.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateBlocos } from './dto/criar-bloco.dto';

@Controller('blocos')
export class BlocosController {
  constructor(private readonly blocosService: BlocosService) {}

  @Post()
  criar(@Body() body: CreateBlocos) {
    return this.blocosService.criarBloco(body);
  }
  @Get()
  listar() {
    return this.blocosService.listas();
  }
}
