jest.mock("@nestjs/jwt", () => ({
  JwtService: class JwtService {},
}));
jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PapelConta } from "../generated/prisma/enums";
import { PrismaService } from "../prisma/prisma.service";
import { AuthService } from "./auth.service";

describe("AuthService privileged accounts", () => {
  let service: AuthService;
  let prisma: {
    funcionario: {
      findFirst: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
    };
    usuario: {
      findFirst: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
    };
    cliente: { findFirst: jest.Mock };
    admin: { findFirst: jest.Mock };
  };
  let signAsync: jest.Mock;

  beforeEach(async () => {
    prisma = {
      funcionario: {
        findFirst: jest.fn().mockResolvedValue(null),
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn(),
      },
      usuario: {
        findFirst: jest.fn().mockResolvedValue(null),
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn(),
      },
      cliente: { findFirst: jest.fn() },
      admin: { findFirst: jest.fn() },
    };
    signAsync = jest.fn().mockResolvedValue("token");

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: { signAsync } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it.each([PapelConta.ADMINISTRADOR, PapelConta.FINANCEIRO])(
    "registers a %s account with its selected role",
    async (papel) => {
      prisma.usuario.create.mockImplementation(({ data }) =>
        Promise.resolve({
          id: 1,
          cpf: data.cpf,
          nome: data.nome,
          email: data.email,
          ativo: true,
          papel: data.papel,
          senha_hash: data.senha_hash,
        }),
      );

      const resultado = await service.registrar({
        cpf: "12345678901",
        nome: "Pessoa Teste",
        email: "Pessoa@exemplo.com",
        senha: "senha-segura",
        papel,
      });

      expect(prisma.usuario.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          cpf: "12345678901",
          nome: "Pessoa Teste",
          email: "pessoa@exemplo.com",
          papel,
        }),
      });
      expect(resultado).toMatchObject({
        usuario: {
          papel,
          email: "pessoa@exemplo.com",
        },
      });
      expect(prisma.funcionario.create).not.toHaveBeenCalled();
      expect(prisma.cliente.findFirst).not.toHaveBeenCalled();
    },
  );

  it("authenticates a privileged account and returns its role in the token payload", async () => {
    const senha = "senha-segura";
    const senhaHash = await bcrypt.hash(senha, 10);
    prisma.usuario.findUnique.mockResolvedValue({
      id: 1,
      cpf: "12345678901",
      nome: "Pessoa Teste",
      email: "pessoa@exemplo.com",
      ativo: true,
      papel: PapelConta.FINANCEIRO,
      senha_hash: senhaHash,
    });

    const resultado = await service.login({
      email: "Pessoa@exemplo.com",
      senha,
    });

    expect(signAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        sub: "1",
        tipoConta: "usuario",
        papel: PapelConta.FINANCEIRO,
      }),
    );
    expect(resultado).toMatchObject({
      access_token: "token",
      usuario: { papel: PapelConta.FINANCEIRO },
    });
  });
});
