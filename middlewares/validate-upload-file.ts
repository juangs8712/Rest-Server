import { Request, Response } from "express";

// -----------------------------------------------------
export const validateUploadedFile = ( req : Request, res : Response, next : Function ) => {
    
    if ( ! req.files || ! req.files.archivo || Object.keys(req.files).length === 0 ) {
        return res.status(400).json({msg: 'No hay archivo en la petición - validarArchivoSubir.'});
    }
    next();
}
// -----------------------------------------------------