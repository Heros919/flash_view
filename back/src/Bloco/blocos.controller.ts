import { BlocosService } from './blocos.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { Papeis } from '../auth/decorators/roles.decorator';
import { Papel } from '../usuario/usuario.service';
import { CreateBlocos } from './dto/criar-bloco.dto';

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
}
