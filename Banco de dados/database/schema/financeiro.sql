CREATE TABLE produto_servico (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL,
    tipo_id INTEGER NOT NULL,

    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco NUMERIC(12,2) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    dataCadastro DATE NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT uq_produto_servico_cliente_id
        UNIQUE (cliente_id, id),

    CONSTRAINT fk_produto_servico_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES cliente(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_produto_servico_tipo
        FOREIGN KEY (tipo_id)
        REFERENCES tipo_produto(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_produto_servico_preco
        CHECK (preco > 0)
);

CREATE INDEX idx_produto_servico_cliente_id
ON produto_servico(cliente_id);

CREATE INDEX idx_produto_servico_tipo_id
ON produto_servico(tipo_id);



CREATE TABLE venda (
    id SERIAL PRIMARY KEY,

    cliente_id INTEGER NOT NULL,
    funcionario_id VARCHAR(100) NOT NULL,

    dataVenda TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    status VARCHAR(10) NOT NULL DEFAULT 'ABERTA',

    total NUMERIC(12,2) NOT NULL DEFAULT 0,

    CONSTRAINT uq_venda_cliente_id
        UNIQUE (cliente_id, id),

    CONSTRAINT fk_venda_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES cliente(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_venda_funcionario_cliente
        FOREIGN KEY (cliente_id, funcionario_id)
        REFERENCES funcionario(cliente_id, id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_venda_status
        CHECK (
            status IN (
                'ABERTA',
                'PAGA',
                'CANCELADA'
            )
        ),

    CONSTRAINT chk_venda_total
        CHECK (total >= 0)
);

CREATE INDEX idx_venda_cliente_id
ON venda(cliente_id);

CREATE INDEX idx_venda_funcionario_id
ON venda(funcionario_id);

CREATE INDEX idx_venda_data
ON venda(dataVenda);

CREATE INDEX idx_venda_status
ON venda(status);


CREATE TABLE venda_item (
    id SERIAL PRIMARY KEY,

    cliente_id INTEGER NOT NULL,
    venda_id INTEGER NOT NULL,
    produto_servico_id INTEGER NOT NULL,

    quantidade NUMERIC(12,3) NOT NULL,
    preco_unitario NUMERIC(12,2) NOT NULL,

    subtotal NUMERIC(14,2)
        GENERATED ALWAYS AS (
            quantidade * preco_unitario
        ) STORED,

    CONSTRAINT fk_venda_item_venda
        FOREIGN KEY (cliente_id, venda_id)
        REFERENCES venda(cliente_id, id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_venda_item_produto_servico
        FOREIGN KEY (cliente_id, produto_servico_id)
        REFERENCES produto_servico(cliente_id, id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_venda_item_quantidade
        CHECK (quantidade > 0),

    CONSTRAINT chk_venda_item_preco
        CHECK (preco_unitario > 0)
);

CREATE INDEX idx_venda_item_venda_id
ON venda_item(cliente_id, venda_id);

CREATE INDEX idx_venda_item_produto
ON venda_item(cliente_id, produto_servico_id);