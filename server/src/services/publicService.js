import * as publicRepository from '../repositories/publicRepository.js';

export const createQuoteRequest = async (data) => {
  if (!data.nome) {
    throw new Error('Nome e obrigatorio');
  }

  if (!data.telefone) {
    throw new Error('Telefone e obrigatorio');
  }

  if (!data.descricao) {
    throw new Error('Descricao e obrigatoria');
  }

  return await publicRepository.createQuoteRequest({
    nome: data.nome,
    telefone: data.telefone,
    instagram: data.instagram || null,
    descricao: data.descricao,
    data: data.data || null,
    observacoes: data.observacoes || null,
  });
};
