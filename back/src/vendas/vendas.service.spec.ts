import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { PapelConta } from '../generated/prisma/enums';
import { VendasService } from './vendas.service';

jest.mock('../generated/prisma/client', () => ({
  Prisma: {
    Decimal: require('@prisma/client/runtime/library').Decimal,
    PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {},
  },
}));

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

const { Decimal } = require('@prisma/client/runtime/library');

describe('VendasService', () => {
  let service: VendasService;
  const prisma = {
    cliente: {
      findUnique: jest.fn(),
    },
    produto_servico: {
      findMany: jest.fn(),
    },
    venda: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendasService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<VendasService>(VendasService);
  });

  it('creates an order attributed to the authenticated finance account', async () => {
    prisma.cliente.findUnique.mockResolvedValue({ id: 8 });
    prisma.produto_servico.findMany.mockResolvedValue([
      {
        id: 12,
        cliente_id: 8,
        ativo: true,
        preco: new Decimal('19.99'),
      },
    ]);
    prisma.venda.create.mockImplementation(({ data }) =>
      Promise.resolve(data),
    );

    const result = await service.criarVenda(
      {
        clienteId: 8,
        itens: [{ produtoServicoId: 12, quantidade: 2.5 }],
      },
      {
        id: 4,
        cpf: '12345678901',
        nome: 'Financeiro',
        email: 'financeiro@exemplo.com',
        ativo: true,
        papel: PapelConta.FINANCEIRO,
      },
    );

    const createArgs = prisma.venda.create.mock.calls[0][0];
    expect(createArgs.data).toMatchObject({
      cliente_id: 8,
      usuario_id: 4,
    });
    expect(createArgs.data.funcionario_id).toBeUndefined();
    expect(createArgs.data.total.toString()).toBe('49.98');
    expect(createArgs.data.venda_item.create[0].subtotal.toString()).toBe(
      '49.98',
    );
    expect(result.usuario_id).toBe(4);
  });
});
