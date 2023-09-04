import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// -----------------------------------------------------
const defaultExt = [ 'png', 'jpg', 'jpeg', 'gif' ];
// -----------------------------------------------------
export const uploadFile = ( 
                files : any, 
                extensionesValidas = defaultExt, 
                carpeta = '' 
            ) => {

    return new Promise( ( resolve, reject ) => {
        const __dirname = path.resolve();
        const { archivo } = files;
    
        const pos = archivo.name.lastIndexOf( '.' );
        const extension = archivo.name.substring( pos + 1 );
        
        // validar la extension 
        if ( !extensionesValidas.includes( extension ) ){
            return reject( `La extensión '${ extension }' no es válida - [${ extensionesValidas }]` )
        }
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join( __dirname, '/uploads/', carpeta, nombreTemp );
    
        archivo.mv( uploadPath, ( err : any ) => {
            if (err) {
                console.log( err );
                return reject( err );
            }
    
            resolve( nombreTemp );
        });
    });
}
// -----------------------------------------------------