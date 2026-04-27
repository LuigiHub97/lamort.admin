import { Router } from 'express';
import authRoutes from './authRoutes.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import clientRoutes from './clientRoutes.js';
import attendanceRoutes from './attendanceRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/clientes', clientRoutes);
router.use('/atendimentos', attendanceRoutes);

router.get('/', (req, res) => {
  res.send('API funcionando');
});

router.get('/protegida', authMiddleware, (req, res) => {
  res.json({
    message: 'Você acessou uma rota protegida',
    user: req.user
  });
});

export default router;