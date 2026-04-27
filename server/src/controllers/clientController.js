import * as clientService from '../services/clientService.js';

export const createCliente = async (req, res) => {
  try {
    const cliente = await clientService.createCliente(req.body);
    res.status(201).json(cliente);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getClientes = async (req, res) => {
  try {
    const clientes = await clientService.getClientes();
    res.json(clientes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateCliente = async (req, res) => {
  try {
    const cliente = await clientService.updateCliente(
      req.params.id,
      req.body
    );
    res.json(cliente);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteCliente = async (req, res) => {
  try {
    await clientService.deleteCliente(req.params.id);
    res.json({ message: 'Cliente deletado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};