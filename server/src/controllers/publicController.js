import * as publicService from '../services/publicService.js';

export const createQuoteRequest = async (req, res) => {
  try {
    const result = await publicService.createQuoteRequest(req.body);

    res.status(201).json({
      message: 'Solicitacao recebida',
      atendimento: result.atendimento,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
