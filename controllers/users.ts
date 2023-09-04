import { Response, Request } from "express";
import bcryptjs from 'bcryptjs';

import { User } from "../models/index.js";

// -----------------------------------------------------
export const getUsers = async (req : Request, res : Response) => {
    // const { q, nombre, apikey } = req.query;
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    // esta es una forma de hacer lo mismo del Promise.all 
    // pero Promise.all se demora mucho menos
    // const usuarios = await User.find( query )
    //     .skip( Number( desde ) )
    //     .limit( Number( limite ) );
    // const total = await User.countDocuments( query );

    const [ total, users ] = await Promise.all( [
        User.countDocuments( query ),
        User.find( query )
            .skip( Number( desde ) )
            .limit( Number( limite ) )
    ] );

    res.json({
        total,
        users
    })
}

// -----------------------------------------------------
export const postUser = async (req : Request, res : Response) => {
    const { name, email, password, rol } = req.body;
    
    const user = new User( { name, email, password, rol } );

    // encryptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );     //hashSync encrypta en una sola via

    await user.save();

    res.status(201).json({ user })
}

// -----------------------------------------------------
export const putUser = async ( req : Request, res : Response) => {
    const { id } = req.params;

    // _id es extraido para validar el _id que viene dentro 
    // del body y evitar que explote el servidor
    const { _id, password, google, email, ...resto } = req.body;

    if( password ){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );     //hashSync encrypta en una sola via
    }
    await User.findByIdAndUpdate( id, resto );
    const user = await User.findById( id );

    res.json({ user });
}

// -----------------------------------------------------
export const deleteUser = async (req : Request, res : Response) => {
    const { id } = req.params;

    // esto es para borrar fisicamente
    // const usuario = await User.findByIdAndDelete( id );

    const user = await User.findByIdAndUpdate( id, { estado: false } );

    res.json({ user })
}

// -----------------------------------------------------
export const patchUser = (req : Request, res : Response) => {
    res.json({
        msg: 'patch API - controlador'
    })
}

// -----------------------------------------------------