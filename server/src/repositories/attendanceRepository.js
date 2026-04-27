import pool from '../config/db.js';

export const createAtendimento = async (data) => {
  const { cliente_id, descricao, status, data: dataAtendimento, valor, observacoes } = data;

  const result = await pool.query(
    `INSERT INTO atendimentos 
      (cliente_id, descricao, status, data, valor, observacoes)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [cliente_id, descricao, status, dataAtendimento, valor, observacoes]
  );

  return result.rows[0];
};

export const getAtendimentos = async () => {
  const result = await pool.query(
    `SELECT atendimentos.*, clientes.nome AS cliente_nome
     FROM atendimentos
     JOIN clientes ON clientes.id = atendimentos.cliente_id
     ORDER BY atendimentos.id DESC`
  );

  return result.rows;
};

export const updateAtendimento = async (id, data) => {
  const { cliente_id, descricao, status, data: dataAtendimento, valor, observacoes } = data;

  const result = await pool.query(
    `UPDATE atendimentos
     SET cliente_id = $1,
         descricao = $2,
         status = $3,
         data = $4,
         valor = $5,
         observacoes = $6
     WHERE id = $7
     RETURNING *`,
    [cliente_id, descricao, status, dataAtendimento, valor, observacoes, id]
  );

  return result.rows[0];
};

export const deleteAtendimento = async (id) => {
  await pool.query('DELETE FROM atendimentos WHERE id = $1', [id]);
};