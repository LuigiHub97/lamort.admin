import pool from '../config/db.js';

export const createQuoteRequest = async (data) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const clienteResult = await client.query(
      `INSERT INTO clientes (nome, telefone, instagram, observacoes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.nome, data.telefone, data.instagram, data.observacoes]
    );

    const cliente = clienteResult.rows[0];

    const atendimentoResult = await client.query(
      `INSERT INTO atendimentos
        (cliente_id, descricao, status, data, valor, observacoes)
       VALUES ($1, $2, 'orcamento', $3, NULL, $4)
       RETURNING *`,
      [cliente.id, data.descricao, data.data, data.observacoes]
    );

    await client.query('COMMIT');

    return {
      cliente,
      atendimento: atendimentoResult.rows[0],
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
