import { Router } from 'express';
import { check } from 'express-validator';

import { googleSignin, login, renewToken } from '../controllers/index.js';
import { validateJWT, validateFields } from '../middlewares/index.js';


// -----------------------------------------------------
const router = Router();

// validar el token.
router.get('/', [ validateJWT ], renewToken );
// -----------------------------------------------------
router.post('/login',[
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validateFields
], login
);
// -----------------------------------------------------
router.post('/google', [
    check('id_token', 'El id_token es necesario').notEmpty(),
    validateFields
], googleSignin
);

// -----------------------------------------------------
export default router;
// -----------------------------------------------------
