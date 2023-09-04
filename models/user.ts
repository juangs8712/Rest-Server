import { Schema, model } from 'mongoose'


// -----------------------------------------------------
export const UserSchema = new Schema({
    name     : { type: String, required: [ true, 'El nombre es obligatorio' ] },
    email    : { type: String, required: [ true, 'El correo es obligatorio' ], unique: true },
    password : { type: String, required: [ true, 'La contraseña es obligatoria'] },
    rol      : { type: String, default: "USER_ROLE", required: true, enum: ['ADMIN_ROLE', 'USER_ROLE'] },
    img      : { type: String },
    state    : { type: Boolean, default: true },
    google   : { type: Boolean, default: false },
});

// -----------------------------------------------------
UserSchema.methods.toJSON = function (){
    // con esta funcion se extrae la version(__v) y la contraseña
    // entonces usuario se queda con el resto de los campos del objeto
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
} 
// -----------------------------------------------------
 
export default model( 'User', UserSchema );