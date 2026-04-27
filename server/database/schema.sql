CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(30),
  instagram VARCHAR(100),
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS atendimentos (
  id SERIAL PRIMARY KEY,
  cliente_id INT NOT NULL,
  descricao TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'orcamento',
  data DATE,
  valor NUMERIC(10,2),
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_cliente
    FOREIGN KEY (cliente_id)
    REFERENCES clientes(id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_atendimentos_cliente_id
  ON atendimentos(cliente_id);

CREATE INDEX IF NOT EXISTS idx_atendimentos_status
  ON atendimentos(status);
