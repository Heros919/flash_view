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
      findUnique: jest.fn(),
      update: jest.fn(),
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
    expect(createArgs.data.venda_item.create[0]).not.toHaveProperty(
      'cliente_id',
    );
    expect(createArgs.data.venda_item.create[0]).not.toHaveProperty(
      'produto_servico_id',
    );
    expect(
      createArgs.data.venda_item.create[0].produto_servico.connect
        .cliente_id_id,
    ).toEqual({ cliente_id: 8, id: 12 });
    expect(createArgs.data.venda_item.create[0]).not.toHaveProperty(
      'subtotal',
    );
    expect(createArgs.data.total.toString()).toBe('49.98');
    expect(result.usuario_id).toBe(4);
  });

  it('concludes an open order using the PAGA status accepted by the database', async () => {
    prisma.venda.findUnique.mockResolvedValue({
      id: 21,
      status: 'ABERTA',
    });
    prisma.venda.update.mockResolvedValue({
      id: 21,
      status: 'PAGA',
    });

    await expect(service.atualizarStatus(21, 'PAGA')).resolves.toEqual({
      id: 21,
      status: 'PAGA',
    });
    expect(prisma.venda.update).toHaveBeenCalledWith({
      where: { id: 21 },
      data: { status: 'PAGA' },
    });
  });
});
