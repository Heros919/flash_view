INSERT INTO tipo_produto (nome)
VALUES
    ('PRODUTO'),
    ('SERVICO')
ON CONFLICT (nome) DO NOTHING;

-- =========================================================
-- PRODUTOS E SERVIÇOS
-- =========================================================

INSERT INTO produto_servico (
    cliente_id,
    tipo_id,
    nome,
    descricao,
    preco,
    ativo
)
VALUES
(
    1,
    (
        SELECT id
        FROM tipo_produto
        WHERE nome = 'PRODUTO'
    ),
    'Chapa de granito',
    'Chapa de granito para venda',
    850.00,
    TRUE
),
(
    1,
    (
        SELECT id
        FROM tipo_produto
        WHERE nome = 'PRODUTO'
    ),
    'Bloco de mármore',
    'Bloco de mármore para venda',
    2500.00,
    TRUE
),
(
    1,
    (
        SELECT id
        FROM tipo_produto
        WHERE nome = 'SERVICO'
    ),
    'Polimento',
    'Serviço de polimento de chapa',
    350.00,
    TRUE
);


-- =========================================================
-- VENDA
-- =========================================================

INSERT INTO venda (
    cliente_id,
    funcionario_id,
    status,
    total
)
VALUES (
    1,
    '1',
    'ABERTA',
    0
);


-- =========================================================
-- ITENS DA VENDA
-- =========================================================

INSERT INTO venda_item (
    cliente_id,
    venda_id,
    produto_servico_id,
    quantidade,
    preco_unitario
)
VALUES
(
    1,
    (
        SELECT id
        FROM venda
        WHERE cliente_id = 1
        ORDER BY id DESC
        LIMIT 1
    ),
    (
        SELECT id
        FROM produto_servico
        WHERE cliente_id = 1
          AND nome = 'Chapa de granito'
        LIMIT 1
    ),
    2,
    850.00
),
(
    1,
    (
        SELECT id
        FROM venda
        WHERE cliente_id = 1
        ORDER BY id DESC
        LIMIT 1
    ),
    (
        SELECT id
        FROM produto_servico
        WHERE cliente_id = 1
          AND nome = 'Polimento'
        LIMIT 1
    ),
    1,
    350.00
);


UPDATE venda v
SET total = (
    SELECT COALESCE(SUM(vi.subtotal), 0)
    FROM venda_item vi
    WHERE vi.cliente_id = v.cliente_id
      AND vi.venda_id = v.id
)
WHERE v.cliente_id = 1
  AND v.id = (
      SELECT id
      FROM venda
      WHERE cliente_id = 1
      ORDER BY id DESC
      LIMIT 1
  );