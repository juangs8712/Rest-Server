import { Response, Request } from "express";
import bcryptjs from 'bcryptjs';

import { User } from '../models/index.js';
import { generateJWT, googleVerify } from "../helpers/index.js";


// -----------------------------------------------------
export const renewToken = async( req : Request, res : Response ) =>{
    const user = req.body.user.toJSON();

    // Generar el JWT
    const token = await generateJWT( user._id );

    res.json({
        user,
        token,
    })
}
// -----------------------------------------------------
export const login = async ( req : Request, res : Response ) => {

    const { email, password } = req.body;
    
    try {
        // verificar si el correo existe
        const user = await User.findOne( { email } );
        if ( ! user ) {
            return res.status( 400 ).json( {
                msg: "Usuario o contraseña incorrectos - correo"
            });
        }
        
        // verificar si el user esta activo
        if ( ! user.state ) {
            return res.status( 400 ).json( {
                msg: "Usuario o contraseña incorrectos - estado: false"
            });
        }

        // verificar la clave
        const validPassword = bcryptjs.compareSync( password, user.password ?? '' );
        if ( ! validPassword ) {
            return res.status( 400 ).json( {
                msg: "Usuario o contraseña incorrectos - password"
            });
        }
        // Generar el JWT
        const token = await generateJWT( user.id );


        res.json({
            user,
            token
        }); 
    } catch (error) {
        console.log(error);
        return res.status( 500 ).json({
            msg: "Hable con el administrador"
        });
    }    
}
// -----------------------------------------------------
export const googleSignin = async ( req : Request, res : Response ) => {
    const { id_token } = req.body;

    try {
        const verify = await googleVerify( id_token );
        const correo = verify?.email;
        const nombre = verify?.name;
        const img    = verify?.img;

        let user = await User.findOne( { correo } );

        if ( ! user ) {
            // crear un user
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            }

            user = new User( data );
            await user.save();
        }

        // si el user esta bloqueado
        if ( !user.state ){
            return res.status( 401 ).json({
                msg: 'Hable con el administrador - usuario bloqueado'
            })
        }

        // Generar el JWT
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        });
        
    } catch (error) {
        console.log( error );
        res.status( 400 ).json({
            msg: 'Token de Google no válido.'
        });
    }

}
// -----------------------------------------------------