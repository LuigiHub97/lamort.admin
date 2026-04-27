import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { findByEmail, createUser } from '../repositories/userRepository.js';

dotenv.config({ quiet: true });

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (email, senha) => {
  const userExists = await findByEmail(email);
  if (userExists) {
    throw new Error('Usuário já existe');
  }

  const hash = await bcrypt.hash(senha, 10);
  const user = await createUser(email, hash);

  return user;
};

export const login = async (email, senha) => {
  const user = await findByEmail(email);
  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const valid = await bcrypt.compare(senha, user.senha_hash);
  if (!valid) {
    throw new Error('Senha inválida');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  return token;
};
