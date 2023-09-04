import { Router } from 'express';
import { check } from 'express-validator';

import { 
    validateFields, 
    validateJWT, 
    isAdminRole, 
    hasRole 
} from '../middlewares/index.js';

import { 
    isValidRole, 
    existsEmail, 
    existsUserById 
} from '../helpers/index.js';

import { 
    getUsers,
    putUser,
    postUser,
    deleteUser,
    patchUser, 
} from '../controllers/users.js';

// -----------------------------------------------------
const router = Router();
// -----------------------------------------------------
router.get('/', getUsers);
// -----------------------------------------------------
router.put('/:id', 
    [
        check( 'id', "No es un ID válido").isMongoId(),
        check( 'id' ).custom( existsUserById ),
        check( 'rol' ).custom( isValidRole ),
        validateFields
    ],
    putUser);
// -----------------------------------------------------
router.post('/',
    [
        check('name', 'El  nombre es obligatorio!!!').notEmpty(),
        check('email', 'El  correo no es válido').isEmail(),
        check('password', 'La contraseña debe tener al menos 6 caracteres.').isLength({ min: 6 }),
        check('email').custom( existsEmail ),
        // check('rol', 'El rol no es válido.').isIn( [ 'ADMIN_ROLE', 'USER_ROLE' ] ),
        check('rol').custom( isValidRole ),
        validateFields        
    ],
    postUser
);
// -----------------------------------------------------
router.delete('/:id', [
    validateJWT,
    // esAdminRole,
    hasRole( [ 'ADMIN_ROLE', 'VENTAS_ROLE', 'OTRO_ROLE' ] ),
    check("id", "No es un ID válido").isMongoId(),
    check( 'id' ).custom( existsUserById ),
    validateFields
], deleteUser);
// -----------------------------------------------------
router.patch('/', patchUser);
// -----------------------------------------------------
export default router;