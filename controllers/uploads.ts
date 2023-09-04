
import path from 'path';
import fs from 'fs';

import { v2 as cloudinary } from 'cloudinary';
import { Request, Response } from "express";
import { UploadedFile } from 'express-fileupload';

import { uploadFile } from "../helpers/index.js";

// -----------------------------------------------------
// cloudinary.config( process.env.CLOUDINARY_URL );
// -----------------------------------------------------
export const loadFile = async ( req : Request, res : Response ) => {

    try {
        // const nombre = await subirArchivo( req.files, [ 'txt', 'md' ], 'textos' );   
        // el undefined es para que cargue los argumentos por defecto 
        const nombre = await uploadFile( req.files, undefined, 'imgs' );   
         
        res.json({ nombre });        
    } catch ( msg ) {
        res.status( 400 ).json({ msg });
    }
}
// -----------------------------------------------------
export const updateImage = async ( req : Request, res : Response ) => {
/*
    Esta funcion es para guardar los datos en el mismo host donde
    se encuentra corriendo el servidor (localhost, heroku...)
*/
    const { coleccion } = req.params;

    const modelo = req.body.coleccion;

    // limpiar imagenes previas
    if ( modelo.img ) {        
        const __dirname = path.resolve();
        const pathImagen 
            = path.join( __dirname, '/uploads', coleccion, modelo.img  ) ;
        
        // preguntar si la imagen existe en el directorio ../uploads/colecion/...
        if ( fs.existsSync( pathImagen ) ) {
            fs.unlinkSync( pathImagen );        // esto borra la imagen del directorio uploads
        }
    }

    modelo.img = await uploadFile( req.files, undefined, coleccion );
    modelo.save();

    res.json( modelo )
}
// -----------------------------------------------------

export const showImage = async ( req : Request, res : Response ) => {
/*
    Esta funcion es para obtener los datos en el mismo host donde
    se encuentra corriendo el servidor (localhost, heroku, ...)
*/
    const { coleccion } = req.params;

    const modelo = req.body.coleccion;

    const __dirname = path.resolve();
    if ( modelo.img ) {        
        const pathImagen 
            = path.join( __dirname, '/uploads', coleccion, modelo.img  ) ;
        
        // preguntar si la imagen existe en el directorio ../uploads/colecion/...
        if ( fs.existsSync( pathImagen ) ) {
            return res.sendFile( pathImagen );        
        }
    }

    const pathPlaceholder = path.join( __dirname, '/assets/no-image.jpg' );
    res.sendFile( pathPlaceholder );
}
// -----------------------------------------------------
// Actualizar una imagen hacia claudinary
export const updateCloudinaryImage 
    = async ( req : Request, res : Response ) => 
{
    // configurar cloudinary
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    
    const modelo = req.body.coleccion;

    // limpiar imagenes previas
    if ( modelo.img ) {        
        const index = modelo.img.lastIndexOf( '/' );

        const imgFileName = modelo.img.substring( index + 1 );
        const public_id = imgFileName.substring( 0, imgFileName.lastIndexOf('.') );
        
        cloudinary.uploader.destroy( public_id );
    }

    const fileArray = req.files!.archivo;
    const file = Array.isArray( fileArray ) 
        ? fileArray[ 0 ]
        : fileArray;

    try {
        // subir la imagen a cloudinary
        const { secure_url } = await cloudinary.uploader.upload( file.tempFilePath );
        modelo.img = secure_url;
        // Eliminar el fichero temporal creado en la carpeta tmp
        fs.unlinkSync( file.tempFilePath ); 

        // guardar el modelo en mongo
        console.log( modelo );
        await modelo.save();
        
        res.json( modelo );
    } catch (error) {
        res.json( { error } )
    }
}
// -----------------------------------------------------
// obtener la imagen desde claudinary
export const showCloudinaryImage = async ( req : Request, res : Response ) => {
    const modelo = req.body.coleccion;

    if ( modelo.img ) {        
        return res.redirect( modelo.img );
    }

    const __dirname = path.resolve();
    
    const pathPlaceholder = path.join( __dirname, '/assets/no-image.jpg' );
    res.sendFile( pathPlaceholder );
}
// -----------------------------------------------------

