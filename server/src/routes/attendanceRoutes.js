import { Router } from 'express';
import * as attendanceController from '../controllers/attendanceController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/', authMiddleware, attendanceController.createAtendimento);
router.get('/', authMiddleware, attendanceController.getAtendimentos);
router.put('/:id', authMiddleware, attendanceController.updateAtendimento);
router.delete('/:id', authMiddleware, attendanceController.deleteAtendimento);

export default router;
