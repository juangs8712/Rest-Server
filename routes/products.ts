import { Router } from 'express';
import { check } from 'express-validator';


import { 
    postProduct, 
    getProductById, 
    getProducts, 
    deleteProduct, 
    putProduct } from '../controllers/index.js';

import { 
    existsCategoryById, 
    existsProductById } from '../helpers/index.js';

import { 
    isAdminRole, 
    validateFields, 
    validateJWT } from '../middlewares/index.js';



// -----------------------------------------------------
const router = Router();
// -----------------------------------------------------
// -----------------------------------------------------
// obtener todas las categorias - publico
router.get('/', getProducts );

// -----------------------------------------------------
// obtener una categoria por id - publico
router.get('/:id', 
    [
        check( 'id', "No es un ID válido").isMongoId(),
        check( 'id' ).custom( existsProductById ),
        validateFields
    ], 
    getProductById
);

// -----------------------------------------------------
// Crear un producto - privado - cualquier persona con un toquen valido
router.post('/', 
    [
        validateJWT,
        check( 'name', 'El nombre es obligatorio' ).notEmpty(),
        check( 'price', 'El precio tiene que ser un número' ).isNumeric(),
        check( 'category', 'No es un id de MongoDB válido' ).isMongoId(),
        check( 'category' ).custom( existsCategoryById ),         
        validateFields
    ], 
    postProduct);

// -----------------------------------------------------
// Actualizar Producto - privado - cualquier persona con un toquen valido
router.put('/:id', 
    [
        validateJWT,
        check( 'id' ).custom( existsProductById ),
        validateFields
    ], 
    putProduct
);

// -----------------------------------------------------
// borrar categoria - privado - solo administradores
router.delete('/:id', 
    [
        validateJWT,
        isAdminRole,
        check( 'id', "No es un ID válido").isMongoId(),
        check( 'id' ).custom( existsProductById ),
    ],
    deleteProduct
);
// -----------------------------------------------------
export default router;