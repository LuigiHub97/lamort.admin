import * as attendanceService from '../services/attendanceService.js';

export const createAtendimento = async (req, res) => {
  try {
    const atendimento = await attendanceService.createAtendimento(req.body);
    res.status(201).json(atendimento);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAtendimentos = async (req, res) => {
  try {
    const atendimentos = await attendanceService.getAtendimentos();
    res.json(atendimentos);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateAtendimento = async (req, res) => {
  try {
    const atendimento = await attendanceService.updateAtendimento(
      req.params.id,
      req.body
    );
    res.json(atendimento);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteAtendimento = async (req, res) => {
  try {
    await attendanceService.deleteAtendimento(req.params.id);
    res.json({ message: 'Atendimento deletado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};