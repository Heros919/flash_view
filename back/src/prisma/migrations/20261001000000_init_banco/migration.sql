CREATE TABLE admin (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);
CREATE TABLE cliente (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    numero VARCHAR(20) NOT NULL,

    CONSTRAINT chk_cliente_cpf
        CHECK (cpf ~ '^[0-9]{11}$')
);

CREATE TABLE endereco (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL,
    complemento VARCHAR(100),
    estado CHAR(2) NOT NULL,
    local_entrega CHAR(3) NOT NULL,

    CONSTRAINT fk_endereco_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES cliente(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT chk_endereco_estado
        CHECK (estado ~ '^[A-Z]{2}$')
);

CREATE INDEX idx_endereco_cliente_id
ON endereco(cliente_id);
CREATE TABLE tipo_produto (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE funcionario (
    id VARCHAR(100) PRIMARY KEY,
    cliente_id INTEGER NOT NULL,
    admin_id INTEGER NOT NULL,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha TEXT NOT NULL,

    CONSTRAINT uq_funcionario_cliente_id
        UNIQUE (cliente_id, id),

    CONSTRAINT fk_funcionario_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES cliente(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_funcionario_admin
        FOREIGN KEY (admin_id)
        REFERENCES admin(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE INDEX idx_funcionario_cliente_id
ON funcionario(cliente_id);

CREATE INDEX idx_funcionario_admin_id
ON funcionario(admin_id);
CREATE TABLE bloco (
    id VARCHAR(100) PRIMARY KEY,

    cliente_id INTEGER NOT NULL,
    funcionario_id VARCHAR(100) NOT NULL,

    codigo VARCHAR(50) NOT NULL UNIQUE,
    numero INTEGER NOT NULL,
    material VARCHAR(150),
    cor VARCHAR(160),
    altura NUMERIC(10,2),
    largura NUMERIC(10,2),
    comprimento NUMERIC(10,2),

    peso NUMERIC(10,2),

    volume NUMERIC(12,3)
        GENERATED ALWAYS AS (
            altura * largura * comprimento
        ) STORED,

    mes INTEGER NOT NULL,
    ano INTEGER NOT NULL,
    frente VARCHAR(50) NOT NULL,

    dataCadastro DATE NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT fk_bloco_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES cliente(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_bloco_funcionario
        FOREIGN KEY (cliente_id, funcionario_id)
        REFERENCES funcionario(cliente_id, id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_bloco_numero
        CHECK (numero >= 0 AND numero <= 99),

    CONSTRAINT chk_bloco_mes
        CHECK (mes >= 1 AND mes <= 12),

    CONSTRAINT chk_bloco_ano
        CHECK (ano >= 2000),

    CONSTRAINT chk_bloco_altura
        CHECK (altura > 0),

    CONSTRAINT chk_bloco_largura
        CHECK (largura > 0),

    CONSTRAINT chk_bloco_comprimento
        CHECK (comprimento > 0),

    CONSTRAINT chk_bloco_peso
        CHECK (peso IS NULL OR peso > 0),

    CONSTRAINT chk_bloco_frente
        CHECK (
            frente IN (
                'A',
                'B',
                'C',
                'D',
                'BARRAGEM',
                'BARREIRO'
            )
        )
);

CREATE INDEX idx_bloco_cliente_id
ON bloco(cliente_id);

CREATE INDEX idx_bloco_funcionario_id
ON bloco(funcionario_id);
CREATE INDEX idx_bloco_material
ON bloco(material);

CREATE INDEX idx_bloco_cor
ON bloco(cor);

CREATE INDEX idx_bloco_frente
ON bloco(frente);

CREATE INDEX idx_bloco_ano
ON bloco(ano);

CREATE INDEX idx_bloco_mes
ON bloco(mes);



CREATE TABLE chapa (
    id VARCHAR(100) PRIMARY KEY,

    cliente_id INTEGER NOT NULL,
    funcionario_id VARCHAR(100) NOT NULL,

    codigo VARCHAR(50) NOT NULL UNIQUE,

    blocoid VARCHAR(100) NOT NULL,

    espessura NUMERIC(10,2),
    altura NUMERIC(10,2),
    largura NUMERIC(10,2),

    acabamento VARCHAR(150),

    status VARCHAR(20) NOT NULL DEFAULT 'DISPONIVEL',

    dataCadastro DATE NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT fk_chapa_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES cliente(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_chapa_funcionario
        FOREIGN KEY (cliente_id, funcionario_id)
        REFERENCES funcionario(cliente_id, id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_chapa_bloco
        FOREIGN KEY (blocoid)
        REFERENCES bloco(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_chapa_espessura
        CHECK (espessura IS NULL OR espessura > 0),

    CONSTRAINT chk_chapa_altura
        CHECK (altura IS NULL OR altura > 0),

    CONSTRAINT chk_chapa_largura
        CHECK (largura IS NULL OR largura > 0),

    CONSTRAINT chk_chapa_status
        CHECK (
            status IN (
                'DISPONIVEL',
                'RESERVADO',
                'VENDIDO'
            )
        )
);

CREATE INDEX idx_chapa_cliente_id
ON chapa(cliente_id);

CREATE INDEX idx_chapa_funcionario_id
ON chapa(funcionario_id);

CREATE INDEX idx_chapa_blocoid
ON chapa(blocoid);

CREATE INDEX idx_chapa_status
ON chapa(status);

CREATE INDEX idx_chapa_acabamento
ON chapa(acabamento);

CREATE TABLE midia (
    id VARCHAR(100) PRIMARY KEY,

    nome VARCHAR(255) NOT NULL,

    tipo VARCHAR(20) NOT NULL,

    formato VARCHAR(100) NOT NULL,

    dados BYTEA NOT NULL,

    blocoid VARCHAR(100),

    chapaid VARCHAR(100),

    dataCadastro DATE NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT fk_midia_bloco
        FOREIGN KEY (blocoid)
        REFERENCES bloco(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_midia_chapa
        FOREIGN KEY (chapaid)
        REFERENCES chapa(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT chk_midia_tipo
        CHECK (
            tipo IN ('FOTO', 'VIDEO')
        ),

    CONSTRAINT chk_midia_origem
        CHECK (
            blocoid IS NOT NULL OR chapaid IS NOT NULL
        )
);
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
