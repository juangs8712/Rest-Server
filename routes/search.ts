
import { Router } from 'express';

import { search } from '../controllers/index.js';

const router = Router();
// -----------------------------------------------------
router.get( '/:colection/:term', search );
// -----------------------------------------------------
export default router;
// -----------------------------------------------------