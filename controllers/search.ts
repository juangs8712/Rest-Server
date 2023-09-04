import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

import { User, Category, Product } from "../models/index.js";
import { transformUid } from "../helpers/index.js";

// -----------------------------------------------------
const allowedCollections = [
    "categories",
    "users",
    "products",
    "role"
];

// -----------------------------------------------------
export const search = async ( req : Request, res : Response ) => {
    const { colection, term } = req.params;
    const { limit = 10, skip = 0 } = req.query;

    if ( ! allowedCollections.includes( colection ) ) {
        return res.status( 400 ).json({
            msg: `Las colecciones permitidas son: [ ${ allowedCollections } ]`
        });
    }

    const nSkip  = Number( skip );
    const nLimit = Number( limit );
    let items : {};

    switch ( colection ) {
        case 'categories':
            items = await searchCategory( term, nSkip, nLimit );
            break;
        case 'users':
            items = await searchUser( term, nSkip, nLimit );
            break;
        case 'products':
            items = await seachProduct( term, nSkip, nLimit );
            break;
        default:
            return res.status( 500 ).json({
                msg: `Búqueda de ${colection} no implementada.`
            })
            break;
    }

    res.json( items );
}
// -----------------------------------------------------
const searchUser = async ( termino = '', skip : number, limit : number ) => {
    const esMongoID = isValidObjectId( termino );
    
    // buscar primero por id en caso de que sea un MongoID
    if ( esMongoID ) {
        const user = await User.findById( termino );
        if ( user ) {
            return [ user ];            
        }
    }
    
    // hacer la busqueda insensible a mayusculas y minusculas
    const regex = RegExp( termino, 'i' );
    const query = { 
        $or:  [ { name: regex }, { email: regex } ],
        $and: [ { state: true } ]
    };
    const [ total, items ] = await Promise.all([
        User.count( query ),
        User.find ( query )
            .skip( skip )
            .limit( limit )
    ]);
    
    return {
        total,
        items
    };  
}
// -----------------------------------------------------
const searchCategory = async ( termino = '', skip : number, limit : number ) => {
    const esMongoID = isValidObjectId( termino );

    // buscar primero por id en caso de que sea un MongoID
    if ( esMongoID ) {
        const category = await Category.findById( termino );
        if ( category ) {
            return [ category ];            
        }
    }

    // hacer la busqueda insensible a mayusculas y minusculas
    const regex = RegExp( termino, 'i' ); 
    const query = { name: regex , state: true };   
    const [ total, items ] = await Promise.all([
        Category.count( query ),
        Category.find( query )
            .skip( skip )
            .limit ( limit )
    ]);

    return {
        total,
        items
    };  
}
// -----------------------------------------------------
const searchCategoryIds = async ( termino = '' ) => {
    const esMongoID = isValidObjectId( termino );

    // hacer la busqueda insensible a mayusculas y minusculas
    const regex = RegExp( termino, 'i' );     
    const categories = await Category
        .find( { name: regex , state: true } )
        .select( '_id' );

    return  categories;  
}
// -----------------------------------------------------
const seachProduct = async ( term = '', skip : number, limit : number ) => {
    const esMongoID = isValidObjectId( term );
    
    // buscar primero por id en caso de que sea un MongoID
    if ( esMongoID ) {
        const product = await Product.findById( term );
        if ( product ) {
            return [ product ];
        }
    }

    const categories = await searchCategoryIds( term );
    const regex = RegExp( term, 'i' ); 
    const query = { 
        $or:  [ 
            { name: regex }, 
            { description: regex }, 
            { category : { $in : categories } } 
        ],
        $and: [ { state: true } ]
    };
    
    // hacer la busqueda insensible a mayusculas y minusculas
    const [ total, items ] = await Promise.all( [
        Product.count( query ),
        Product.find( query )
            .skip( skip )
            .limit( limit )
    ]);

    return {
        total,
        items
    };  
}

// -----------------------------------------------------
