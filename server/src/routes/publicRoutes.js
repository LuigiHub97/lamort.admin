import { Router } from 'express';
import * as publicController from '../controllers/publicController.js';

const router = Router();

router.post('/orcamento', publicController.createQuoteRequest);

export default router;
