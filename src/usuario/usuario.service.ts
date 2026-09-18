import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export enum Papel {
  Funcionario = 'FUNCIONARIO',
  Financeiro = 'FINANCEIRO',
  Administrador = 'ADMINISTRADOR'
}

export type Usuario = {
  cpf: number;
  nome: string;
  email: string;
  senhaHash: string;
  ativo: boolean;
  papel: Papel;
};

export type UsuarioAutenticado = Omit<Usuario, 'senhaHash'>;

@Injectable()
export class UsuarioService {
  // Temporário: enquanto não há banco. Em produção o hash vem do banco.
  private readonly usuarios: Usuario[] = [
    {
      cpf: 1,
      nome: 'Henrique Luiz Dantas',
      email: 'henrique@empresa.com',
      senhaHash: bcrypt.hashSync('123456', 10),
      ativo: true,
      papel: Papel.Administrador
    },
    {
      cpf: 2,
      nome: 'Claudio Araujo Casta',
      email: 'caraujo@empresa.com',
      senhaHash: bcrypt.hashSync('123456', 10),
      ativo: true,
      papel: Papel.Financeiro
    },
    {
      cpf: 3,
      nome: 'Luiz Conzaga Garcia',
      email: 'conzaga@empresa.com',
      senhaHash: bcrypt.hashSync('123456', 10),
      ativo: true,
      papel: Papel.Funcionario
    }
  ];

  buscarPorEmail(email: string): Usuario | undefined {
    const alvo = email.trim().toLowerCase();
    return this.usuarios.find((u) => u.email.toLowerCase() === alvo);
  }

  buscarPorId(cpf: number): Usuario | undefined {
    return this.usuarios.find((u) => u.cpf === cpf);
  }

  semSenha(usuario: Usuario): UsuarioAutenticado {
    return {
      cpf: usuario.cpf,
      nome: usuario.nome,
      email: usuario.email,
      ativo: usuario.ativo,
      papel: usuario.papel
    };
  }
}
