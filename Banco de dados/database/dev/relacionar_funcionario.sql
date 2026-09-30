ALTER TABLE bloco
    ADD COLUMN IF NOT EXISTS funcionario_id VARCHAR(100);

ALTER TABLE chapa
    ADD COLUMN IF NOT EXISTS funcionario_id VARCHAR(100);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_bloco_funcionario'
          AND conrelid = 'bloco'::regclass
    ) THEN
        ALTER TABLE bloco
            ADD CONSTRAINT fk_bloco_funcionario
            FOREIGN KEY (funcionario_id)
            REFERENCES funcionario(id)
            ON UPDATE CASCADE
            ON DELETE RESTRICT;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_chapa_funcionario'
          AND conrelid = 'chapa'::regclass
    ) THEN
        ALTER TABLE chapa
            ADD CONSTRAINT fk_chapa_funcionario
            FOREIGN KEY (funcionario_id)
            REFERENCES funcionario(id)
            ON UPDATE CASCADE
            ON DELETE RESTRICT;
    END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_bloco_funcionario_id
    ON bloco(funcionario_id);

CREATE INDEX IF NOT EXISTS idx_chapa_funcionario_id
    ON chapa(funcionario_id);


