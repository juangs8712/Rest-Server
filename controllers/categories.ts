import { Request, Response } from "express"

import { Category } from '../models/index.js';
import { transformUid } from "../helpers/index.js";

// -----------------------------------------------------
const populateOptions = {
    path: 'user',
    select : '_id name email',
    transform: transformUid
    // transform: ( doc ) => ({ uid: doc._id, name: doc.name, email: doc.email })
}
// -----------------------------------------------------
// Obtener categorias - paginado - total - populate
export const getCategories = async (req : Request, res : Response ) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { state: true };

    const [ total, items ] = await Promise.all( [
        Category.countDocuments( query ),
        Category.find( query )
            .populate( populateOptions )
            .skip( Number( desde ) )
            .limit( Number( limite ) )
    ] );

    // categorias 
    res.json( {
        total,
        items
    })
}

// -----------------------------------------------------
// Obtener categoria - populate
export const getCategoryById = async ( req : Request, res : Response ) => {
    const { id } = req.params;

    const category = await Category.findById( id )
        .populate( populateOptions );

    res.json({
        category
    })
}

// -----------------------------------------------------
// Crear categorias
export const postCategory = async ( req : Request, res : Response ) => {
    const name = req.body.name.toUpperCase();
    
    const categoriaDB = await Category.findOne( { name } );

    if ( categoriaDB ){
        return res.status( 400 ).json( {
            msg: `La categoria ${ categoriaDB.name } ya existe.`
        } );
    }

    const data = {
        name,
        user: req.body.user._id
    }

    const c = new Category( data );
    await c.save();
    const category = await Category.findById( c._id )
        .populate( populateOptions );

    res.status( 201 ).json({ category });
}

// -----------------------------------------------------
// Actualizar categoria
export const putCategory = async ( req : Request, res : Response ) => {
    const { id } = req.params;

    const { state, user, ...data } = req.body;
    data.user = req.body.user._id;

    // el { new: true } es para que categoria quede con la informacion actualizada
    const category = await Category
        .findByIdAndUpdate( id, data, { new: true } )
        .populate( populateOptions );

    res.json({ category });
}

// -----------------------------------------------------
// borrar categoria - estado: false
export const deleteCategory = async (req : Request, res : Response) => {
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate( id, { estado: false }, { new: true } );

    res.json({ category });
}

// -----------------------------------------------------


