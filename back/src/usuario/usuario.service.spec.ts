import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { PapelConta } from '../generated/prisma/enums';
import { RegistroDto } from '../auth/dto/registro.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Papel, UsuarioService } from './usuario.service';

jest.mock('../generated/prisma/client', () => ({
  Prisma: {
    PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {}
  }
}));

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: class PrismaService {}
}));

describe('UsuarioService registration', () => {
  let service: UsuarioService;
  let create: jest.Mock;
  let prisma: {
    usuario: {
      findUnique: jest.Mock;
      create: jest.Mock;
    };
  };

  beforeEach(async () => {
    create = jest.fn();
    prisma = {
      usuario: {
        findUnique: jest.fn(),
        create
      }
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        { provide: PrismaService, useValue: prisma }
      ]
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
  });

  it('stores a hashed password and assigns the FUNCIONARIO role', async () => {
    const dados: RegistroDto = {
      cpf: '12345678901',
      nome: 'Pessoa Teste',
      email: 'Pessoa@exemplo.com',
      senha: 'senha-segura'
    };
    create.mockImplementation(({ data }) =>
      Promise.resolve({
        ...data,
        ativo: true,
        datacadastro: new Date()
      })
    );

    const usuario = await service.criar(dados);

    const dadosSalvos = create.mock.calls[0][0].data;
    expect(dadosSalvos.papel).toBe(PapelConta.FUNCIONARIO);
    expect(dadosSalvos.email).toBe('pessoa@exemplo.com');
    expect(dadosSalvos.senha_hash).not.toBe(dados.senha);
    await expect(bcrypt.compare(dados.senha, dadosSalvos.senha_hash)).resolves.toBe(true);
    expect(usuario).toMatchObject({
      cpf: dados.cpf,
      papel: Papel.Funcionario
    });
    expect(usuario).not.toHaveProperty('senhaHash');
  });

  it('rejects registration with an email already used by a seeded account', async () => {
    await expect(
      service.criar({
        cpf: '12345678901',
        nome: 'Pessoa Teste',
        email: 'henrique@empresa.com',
        senha: 'senha-segura'
      })
    ).rejects.toBeInstanceOf(ConflictException);

    expect(create).not.toHaveBeenCalled();
  });
});
