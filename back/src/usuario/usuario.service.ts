import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export enum Papel {
  Funcionario = 'FUNCIONARIO',
  Financeiro = 'FINANCEIRO',
  Administrador = 'ADMINISTRADOR'
}

export type Usuario = {
  id: number;
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
      id: 1,
      nome: 'Henrique Luiz Dantas',
      email: 'henrique@empresa.com',
      senhaHash: bcrypt.hashSync('123456', 10),
      ativo: true,
      papel: Papel.Administrador
    },
    {
      id: 2,
      nome: 'Claudio Araujo Casta',
      email: 'caraujo@empresa.com',
      senhaHash: bcrypt.hashSync('123456', 10),
      ativo: true,
      papel: Papel.Financeiro
    },
    {
      id: 3,
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

  buscarPorId(id: number): Usuario | undefined {
    return this.usuarios.find((u) => u.id === id);
  }

  semSenha(usuario: Usuario): UsuarioAutenticado {
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      ativo: usuario.ativo,
      papel: usuario.papel
    };
  }
}
