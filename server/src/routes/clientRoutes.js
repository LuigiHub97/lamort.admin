import { Router } from 'express';
import * as clientController from '../controllers/clientController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/', authMiddleware, clientController.createCliente);
router.get('/', authMiddleware, clientController.getClientes);
router.put('/:id', authMiddleware, clientController.updateCliente);
router.delete('/:id', authMiddleware, clientController.deleteCliente);

export default router;