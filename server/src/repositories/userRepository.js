import pool from '../config/db.js';

export const findByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM usuarios WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

export const createUser = async (email, senha_hash) => {
  const result = await pool.query(
    'INSERT INTO usuarios (email, senha_hash) VALUES ($1, $2) RETURNING *',
    [email, senha_hash]
  );
  return result.rows[0];
};