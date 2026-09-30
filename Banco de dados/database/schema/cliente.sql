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