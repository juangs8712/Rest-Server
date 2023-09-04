import { Request, Response } from "express";

import { Product, User } from "../models/index.js";
import { checkCollectionAndId } from '../helpers/index.js';

// -----------------------------------------------------
const allowedCollections = [
    { name: 'productos',  colection: Product },
    { name: 'usuarios',   colection: User }
];

// -----------------------------------------------------
export const checkUploadsParam = async ( req : Request, res : Response, next : Function ) => {
    try {
        await checkCollectionAndId( req, allowedCollections );
    } catch ( error : any ) {
        console.log( error );
        return res.status( 400 ).json( { msg: error.message } );
    }
    next();
}
// -----------------------------------------------------