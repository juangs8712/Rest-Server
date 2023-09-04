import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../models/index.js';

// -----------------------------------------------------
export const validateJWT = async ( req : Request, res : Response, next : Function ) => {
    // el x-token se envia en el header desde el cliente (Ej. desde Postman)
    const token = req.header( 'x-token' );

    // si el token no existe, retornar con un error 401
    if ( ! token ){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        // obtener el uid del usuario
        const  jwtPayload = jwt.verify( token, process.env.SECRETORPRIVATEKEY ?? '' );
        if ( 'string' === typeof jwtPayload ) {
            throw new Error( jwtPayload );            
        }
        
        const uid : string = jwtPayload.uid;
        // leer el usuario que corresponde al uid
        const user = await User.findById( uid.toString() );

        // si el usuario no existe retorna con un error 401
        if ( !user ){
            return res.status( 401 ).json({
                msg: 'Token no válido - usuario no existe en DB'
            });
        }

        // si el usuario.estado === false retorna un error 401
        if ( ! user.state ){
            return res.status( 401 ).json({
                msg: 'Token no válido - usuario con estado: false'
            });
        }

        // agregar la informacion del usuario al request
        req.body.user = user;

        // ejecutar el middleware siguiente
        next();
    } catch ( error : any ) {
        console.log( error.message );
        
        return res.status( 401 ).json({
            msg: 'Token no válido'
        });
    }
}
// -----------------------------------------------------