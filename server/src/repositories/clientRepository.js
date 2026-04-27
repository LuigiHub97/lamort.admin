import pool from '../config/db.js';

export const createCliente = async (cliente) => {
  const { nome, telefone, instagram, observacoes } = cliente;

  const result = await pool.query(
    `INSERT INTO clientes (nome, telefone, instagram, observacoes)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [nome, telefone, instagram, observacoes]
  );

  return result.rows[0];
};

export const getClientes = async () => {
  const result = await pool.query(
    'SELECT * FROM clientes ORDER BY id DESC'
  );
  return result.rows;
};

export const updateCliente = async (id, data) => {
  const { nome, telefone, instagram, observacoes } = data;

  const result = await pool.query(
    `UPDATE clientes
     SET nome = $1,
         telefone = $2,
         instagram = $3,
         observacoes = $4
     WHERE id = $5
     RETURNING *`,
    [nome, telefone, instagram, observacoes, id]
  );

  return result.rows[0];
};

export const deleteCliente = async (id) => {
  await pool.query('DELETE FROM clientes WHERE id = $1', [id]);
};