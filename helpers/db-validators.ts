
import { Request } from "express";

import { Category, Product, Role, User } from "../models/index.js";

// -----------------------------------------------------
export const isValidRole = async( rol = '' ) => {
    const existsRole = await Role.findOne({ rol });

    if ( !existsRole ){
        throw new Error( `El rol ${ rol } no está registrado en la BD.` )
    }
}
// -----------------------------------------------------
// export default esRoleValido;
// -----------------------------------------------------
export const existsEmail = async( email = '' ) => {
    const existeEmail = await User.findOne( { email } );
    if ( existeEmail ){
        throw new Error( `El correo ${ email } ya está registrado.` )
    }
}
// -----------------------------------------------------
export const existsUserById = async( id : string ) => {
    const existsUser = await User.findById( id )
    
    if ( !existsUser ){
        throw new Error( `El ID: ${ id } no existe en usuarios.` )
    }
}
// -----------------------------------------------------
export const existsCategoryById = async( id : string ) => {
    const category = await Category.findById( id )

    if ( !category ){
        throw new Error( `El ID: ${ id } no existe en categorias.` )
    }
}
// -----------------------------------------------------
export const existsProductById = async( id : string ) => {
    const product = await Product.findById( id )

    if ( !product ){
        throw new Error( `El ID: ${ id } no existe en productos.` )
    }
}
// -----------------------------------------------------
export const allowedCollections = ( 
    coleccion = '', 
    colecciones : Array< any > 
) => {
    const includeCollection = colecciones.includes( coleccion );
    
    if ( ! includeCollection ) {
        throw new Error( `La colección ${ coleccion } no es permitida - [ ${ colecciones } ]` );
    }

    return true;
}
// -----------------------------------------------------

export const checkCollectionAndId = async( 
    req : Request,
    colecciones : Array< any > ) => {

    const { id, collection } = req.params;
    const data = colecciones.find( c => c.name === collection );

    // comprobar que la coleccion este contenida dentro de colecciones
    if ( ! data  ){
        throw new Error ( `La colección '${ collection }' no está permitida` );
    }

    // comprobar si el id se encuentra en la coleccion especificada
    const existId = await data.colection.findById( id );          
    if ( ! existId ) {
        throw new Error( `El Id '${ id }' no se encuentra en la colección '${ collection }'` );
    } 
    // agregar el usuario/producto al Request
    req.body.coleccion = existId;
    return true;
}
// -----------------------------------------------------
