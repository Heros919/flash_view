import { ChapasService } from './chapas.service';
import { Papeis } from 'src/auth/decorators/roles.decorator';
import { CreatChapas } from './dto/criar-chapas.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { Papel } from 'src/usuario/usuario.service';

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
}
