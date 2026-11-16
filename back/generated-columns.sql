ALTER TABLE bloco DROP COLUMN volume;
ALTER TABLE bloco ADD COLUMN volume numeric(12,3)
  GENERATED ALWAYS AS (altura * largura * comprimento) STORED;

ALTER TABLE venda_item DROP COLUMN subtotal;
ALTER TABLE venda_item ADD COLUMN subtotal numeric(14,2)
  GENERATED ALWAYS AS (quantidade * preco_unitario) STORED;