import * as authService from '../services/authService.js';

export const register = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await authService.register(email, senha);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const token = await authService.login(email, senha);
    res.json({ token });
  } catch (err) {
    console.log(err);
res.status(400).json({ error: err.message || 'Erro interno' });
  }
};