import { Injectable } from '@nestjs/common';

export type Papel = 'Funcionario' | 'Financeiro' | 'Adiministrador';

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  senha: string;
  ativo: boolean;
  papel: string;
};

export type UsuaioAutenticado = Omit<Usuario, 'senha'>;

@Injectable()
export class UsuarioService {
  private readonly usuario: Usuario[] = [
    {
      id: 1,
      nome: 'Henrique Luiz Dantas',
      email: 'henrique@empresa.com',
      senha: '123456',
      ativo: true,
      papel: 'Adiministrador'
    },
    {
      id: 2,
      nome: 'Claudio Araujo Casta',
      email: 'caraujo@empresa.com',
      senha: '123456',
      ativo: true,
      papel: 'Financeiro'
    },
    {
      id: 3,
      nome: 'Luiz Conzaga Garcia',
      email: 'conzaga@empresa.com',
      senha: '123456',
      ativo: true,
      papel: 'Funcionario'
    }
  ];

  buscarporemail(email: string): Usuario | undefined {
    return this.usuario.find((u) => u.email === email);
  }
}
