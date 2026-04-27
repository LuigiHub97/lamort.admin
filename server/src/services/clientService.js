import * as clientRepo from '../repositories/clientRepository.js';

export const createCliente = async (data) => {
  if (!data.nome) {
    throw new Error('Nome é obrigatório');
  }

  return await clientRepo.createCliente(data);
};

export const getClientes = async () => {
  return await clientRepo.getClientes();
};

export const updateCliente = async (id, data) => {
  if (!data.nome) {
    throw new Error('Nome é obrigatório');
  }

  return await clientRepo.updateCliente(id, data);
};

export const deleteCliente = async (id) => {
  return await clientRepo.deleteCliente(id);
};