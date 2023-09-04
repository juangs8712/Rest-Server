import { Router } from 'express';
import { check } from 'express-validator';

import { existsCategoryById } from '../helpers/index.js';
import { 
    deleteCategory, 
    putCategory, 
    postCategory, 
    getCategories, 
    getCategoryById 
} from '../controllers/index.js';

import { 
    isAdminRole, 
    hasRole, 
    validateFields, 
    validateJWT 
} from '../middlewares/index.js';


// -----------------------------------------------------
const router = Router();

// -----------------------------------------------------
// obtener todas las categorias - publico
router.get('/', getCategories );

// -----------------------------------------------------
// obtener una categoria por id - publico
router.get('/:id', 
    [
        check("id", "No es un ID válido").isMongoId(),
        check( 'id' ).custom( existsCategoryById ),
        validateFields
    ], 
    getCategoryById
);

// -----------------------------------------------------
// Crear una categoria - privado - cualquier persona con un toquen valido
router.post('/', 
    [
        validateJWT,
        check( 'name', 'El nombre es obligatorio' ).notEmpty(),
        validateFields
    ], 
    postCategory);

// -----------------------------------------------------
// Actualizar categoria - privado - cualquier persona con un toquen valido
router.put('/:id', 
    [
        validateJWT,
        check( 'id' ).custom( existsCategoryById ),
        check( 'name', 'El nombre es obligatorio' ).notEmpty(),
        validateFields
    ], 
    putCategory
);

// -----------------------------------------------------
// borrar categoria - privado - solo administradores
router.delete('/:id', 
    [
        validateJWT,
        isAdminRole,
        check("id", "No es un ID válido").isMongoId(),
        check( 'id' ).custom( existsCategoryById ),
    ],
    deleteCategory
);
// -----------------------------------------------------
export default router;
// -----------------------------------------------------
