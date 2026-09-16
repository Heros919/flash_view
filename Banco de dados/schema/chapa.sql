CREATE TABLE chapa (
    id VARCHAR(100) PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    blocoid VARCHAR(100) NOT NULL,
    espessura NUMERIC(10,2),
    altura NUMERIC(10,2),
    largura NUMERIC(10,2),
    acabamento VARCHAR(150),
    status VARCHAR(20) NOT NULL DEFAULT 'DISPONIVEL',
    dataCadastro DATE NOT NULL DEFAULT CURRENT_DATE,

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

CREATE INDEX idx_chapa_blocoid
ON chapa(blocoid);

CREATE INDEX idx_chapa_status
ON chapa(status);

CREATE INDEX idx_chapa_acabamento
ON chapa(acabamento);
