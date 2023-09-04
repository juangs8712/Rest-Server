import { Router } from 'express';
import { check } from 'express-validator';


import { 
    updateCloudinaryImage,
    showCloudinaryImage
} from '../controllers/index.js';
import { 
    checkUploadsParam, 
    validateUploadedFile, 
    validateFields 
} from '../middlewares/index.js';


// -----------------------------------------------------
const router = Router();
// -----------------------------------------------------

// router.post( '/', validarArchivoSubir, cargarArchivo ); // este sube los archivos a local
router.post( '/', validateUploadedFile, updateCloudinaryImage );
// -----------------------------------------------------
// esta es otra forma de validar un parametro
// check( 'coleccion' ).custom( c => coleccionesPermitidas( c, [ 'usuarios', 'productos' ] ) ),
router.put( '/:coleccion/:id', [
    check( 'id', 'El id deber ser de mongo' ).isMongoId(),
    validateUploadedFile,
    validateFields,
    checkUploadsParam
], updateCloudinaryImage );
// -----------------------------------------------------
router.get('/:coleccion/:id', [
    check( 'id', 'El id deber ser de mongo' ).isMongoId(),
    validateFields,
    checkUploadsParam
], showCloudinaryImage );
// -----------------------------------------------------

// -----------------------------------------------------

// -----------------------------------------------------

export default router;
// -----------------------------------------------------
