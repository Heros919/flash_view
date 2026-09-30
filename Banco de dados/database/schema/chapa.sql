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
