import { Request, Response } from "express"

import { Product, Category } from '../models/index.js';
import { transformUid } from "../helpers/index.js";


// -----------------------------------------------------
const populateUser = {
    path: 'user',
    select : '_id name email',
    transform: transformUid
    // transform: ( doc ) => ({ uid: doc._id, name: doc.name, email: doc.email })
}
const populateCategory = {
    path: 'category',
    select : '_id name',
    transform: transformUid
    // transform: ( doc ) => ({ uid: doc._id, name: doc.name, email: doc.email })
}
// -----------------------------------------------------
// Obtener Productos - paginado - total - populate
export const getProducts = async (req : Request, res : Response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, items ] = await Promise.all( [
        Product.countDocuments( query ), 
        Product.find( query )
            .populate( populateUser )
            .populate( populateCategory )
            .skip( Number( desde ) )
            .limit( Number( limite ) )
    ] );

    // categorias 
    res.json({
        total,
        items
    })
}

// -----------------------------------------------------
// Obtener Productos por id - populate
export const getProductById = async ( req : Request, res : Response ) => {
    const { id } = req.params;

    const item = await Product.findById( id )
        .populate( populateUser )
        .populate( populateCategory );

    res.json({
        item
    })
}

// -----------------------------------------------------
// Crear Productos
export const postProduct = async ( req : Request, res : Response ) => {
    const { usuario, name, estado, ...resto } = req.body;
    
    // validar si el producto ya existe en la BD 
    const productoDB = await Product.findOne( { name: name.toUpperCase() } );    
    if ( productoDB ){
        return res.status( 400 ).json( {
            msg: `El producto ${ productoDB.name } ya existe.`
        } );
    }

    const data = {
        ...resto,
        name: name.toUpperCase(),
        user: req.body.user._id
    }
    const p = new Product( data );
    await p.save(  );
    const product = await Product.findById( p._id )
        .populate( populateUser )
        .populate( populateCategory );

    res.status( 201 ).json({ product });
}

// -----------------------------------------------------
// Actualizar categoria
export const putProduct = async ( req : Request, res : Response ) => {
    const { id } = req.params;

    const { state, user, category, ...data } = req.body;
    data.user = req.body.user._id;

    try {
        // verificar la categoria
        if ( category ) {
            await Category.findById( category );            
            data.category = category;
        }
    } catch (error) {
        console.log( error );
        
        return res.status( 400 ).json({
            msg: `El ID: ${ category } no corresponde a ninguna categoria.`
        })
    }

    // el { new: true } es para que producto quede con la informacion actualizada
    const product = await Product
        .findByIdAndUpdate( id, data, { new: true } )
        .populate( populateUser )
        .populate( populateCategory );

    res.json({ product });
}

// -----------------------------------------------------
// borrar producto - estado: false
export const deleteProduct = async (req : Request, res : Response) => {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate( id, { estado: false }, { new: true } );

    res.json({ product })
}

// -----------------------------------------------------