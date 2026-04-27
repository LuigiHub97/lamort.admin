import * as attendanceRepo from '../repositories/attendanceRepository.js';

export const createAtendimento = async (data) => {
  if (!data.cliente_id) {
    throw new Error('cliente_id é obrigatório');
  }

  if (!data.descricao) {
    throw new Error('descricao é obrigatória');
  }

  return await attendanceRepo.createAtendimento(data);
};

export const getAtendimentos = async () => {
  return await attendanceRepo.getAtendimentos();
};

export const updateAtendimento = async (id, data) => {
  if (!data.cliente_id) {
    throw new Error('cliente_id é obrigatório');
  }

  if (!data.descricao) {
    throw new Error('descricao é obrigatória');
  }

  return await attendanceRepo.updateAtendimento(id, data);
};

export const deleteAtendimento = async (id) => {
  return await attendanceRepo.deleteAtendimento(id);
};