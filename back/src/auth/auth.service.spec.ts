jest.mock("@nestjs/jwt", () => ({
  JwtService: class JwtService {},
}));
jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

import { Test, TestingModule } from "@nestjs/testing";
import { ForbiddenException } from "@nestjs/common";
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
      update: jest.Mock;
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
        update: jest.fn(),
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
    "does not allow public registration as %s",
    async (papel) => {
      await expect(
        service.registrar({
          cpf: "12345678901",
          nome: "Pessoa Teste",
          email: "Pessoa@exemplo.com",
          senha: "senha-segura",
          papel,
        }),
      ).rejects.toBeInstanceOf(ForbiddenException);

      expect(prisma.usuario.create).not.toHaveBeenCalled();
      expect(prisma.funcionario.create).not.toHaveBeenCalled();
    },
  );

  it("creates the first administrator with the configured key", async () => {
    const chave = "chave-de-configuracao-segura-com-32-caracteres";
    const chaveAnterior = process.env.ADMIN_BOOTSTRAP_KEY;
    process.env.ADMIN_BOOTSTRAP_KEY = chave;
    prisma.usuario.create.mockImplementation(({ data }) =>
      Promise.resolve({
        id: 1,
        cpf: data.cpf,
        nome: data.nome,
        email: data.email,
        ativo: true,
        papel: data.papel,
      }),
    );

    try {
      await expect(
        service.bootstrapAdministrador(
          {
            cpf: "12345678901",
            nome: "Admin Inicial",
            email: "admin@exemplo.com",
            senha: "senha-segura",
          },
          chave,
        ),
      ).resolves.toMatchObject({
        usuario: {
          papel: PapelConta.ADMINISTRADOR,
          email: "admin@exemplo.com",
        },
      });
    } finally {
      if (chaveAnterior === undefined) {
        delete process.env.ADMIN_BOOTSTRAP_KEY;
      } else {
        process.env.ADMIN_BOOTSTRAP_KEY = chaveAnterior;
      }
    }
  });

  it("updates the existing administrator's access instead of rejecting setup", async () => {
    const chave = "chave-de-configuracao-segura-com-32-caracteres";
    const chaveAnterior = process.env.ADMIN_BOOTSTRAP_KEY;
    process.env.ADMIN_BOOTSTRAP_KEY = chave;
    prisma.usuario.findFirst
      .mockResolvedValueOnce({
        id: 8,
        cpf: "10987654321",
        email: "admin-anterior@exemplo.com",
        papel: PapelConta.ADMINISTRADOR,
      })
      .mockResolvedValue(null);
    prisma.usuario.update.mockImplementation(({ where, data }) =>
      Promise.resolve({
        id: where.id,
        ...data,
      }),
    );

    try {
      await expect(
        service.bootstrapAdministrador(
          {
            cpf: "12345678901",
            nome: "Admin Recuperado",
            email: "admin@exemplo.com",
            senha: "senha-segura",
          },
          chave,
        ),
      ).resolves.toMatchObject({
        mensagem: "Acesso do Administrador configurado com sucesso.",
        usuario: {
          id: 8,
          email: "admin@exemplo.com",
          papel: PapelConta.ADMINISTRADOR,
        },
      });

      expect(prisma.usuario.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 8 },
          data: expect.objectContaining({
            cpf: "12345678901",
            email: "admin@exemplo.com",
            ativo: true,
          }),
        }),
      );
      expect(prisma.usuario.create).not.toHaveBeenCalled();
    } finally {
      if (chaveAnterior === undefined) {
        delete process.env.ADMIN_BOOTSTRAP_KEY;
      } else {
        process.env.ADMIN_BOOTSTRAP_KEY = chaveAnterior;
      }
    }
  });

  it("creates a financial account with the configured key", async () => {
    const chave = "chave-de-configuracao-segura-com-32-caracteres";
    const chaveAnterior = process.env.ADMIN_BOOTSTRAP_KEY;
    process.env.ADMIN_BOOTSTRAP_KEY = chave;
    prisma.usuario.create.mockImplementation(({ data }) =>
      Promise.resolve({
        id: 2,
        ...data,
      }),
    );

    try {
      await expect(
        service.bootstrapFinanceiro(
          {
            cpf: "12345678901",
            nome: "Financeiro",
            email: "financeiro@exemplo.com",
            senha: "senha-segura",
          },
          chave,
        ),
      ).resolves.toMatchObject({
        mensagem: "Acesso do Financeiro configurado com sucesso.",
        usuario: {
          papel: PapelConta.FINANCEIRO,
          email: "financeiro@exemplo.com",
        },
      });

      expect(prisma.usuario.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          papel: PapelConta.FINANCEIRO,
          ativo: true,
        }),
      });
    } finally {
      if (chaveAnterior === undefined) {
        delete process.env.ADMIN_BOOTSTRAP_KEY;
      } else {
        process.env.ADMIN_BOOTSTRAP_KEY = chaveAnterior;
      }
    }
  });

  it("returns an employee's own ID after login", async () => {
    const senha = "senha-segura";
    const senhaHash = await bcrypt.hash(senha, 10);
    prisma.funcionario.findUnique.mockResolvedValue({
      id: "funcionario-id",
      cpf: "12345678901",
      nome: "Funcionário",
      email: "funcionario@exemplo.com",
      senha: senhaHash,
      cliente_id: 7,
      admin_id: 1,
    });

    const resultado = await service.login({
      email: "funcionario@exemplo.com",
      senha,
    });

    expect(signAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        sub: "funcionario-id",
        papel: PapelConta.FUNCIONARIO,
      }),
    );
    expect(resultado).toMatchObject({
      funcionario: {
        id: "funcionario-id",
        papel: PapelConta.FUNCIONARIO,
      },
    });
  });

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
