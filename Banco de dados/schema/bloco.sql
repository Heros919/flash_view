CREATE TABLE bloco (
    id VARCHAR(100) PRIMARY KEY,
    -- Código gerado pelo sistema
    codigo VARCHAR(50) NOT NULL UNIQUE,
    numero INTEGER NOT NULL,
    material VARCHAR(150),
    cor VARCHAR(160),
    altura NUMERIC(10,2),
    largura NUMERIC(10,2),
    comprimento NUMERIC(10,2),
    peso NUMERIC(10,2),
    mes INTEGER NOT NULL,
    ano INTEGER NOT NULL,
    frente VARCHAR(50) NOT NULL,
    dataCadastro DATE NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT chk_bloco_numero
        CHECK (numero >= 0 AND numero <= 99),

    CONSTRAINT chk_bloco_mes
        CHECK (mes >= 1 AND mes <= 12),

    CONSTRAINT chk_bloco_ano
        CHECK (ano >= 2000),

    CONSTRAINT chk_bloco_altura
        CHECK (altura IS NULL OR altura > 0),

    CONSTRAINT chk_bloco_largura
        CHECK (largura IS NULL OR largura > 0),

    CONSTRAINT chk_bloco_comprimento
        CHECK (comprimento IS NULL OR comprimento > 0),

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
