
import mongoose, { Schema, model } from 'mongoose';

// -----------------------------------------------------
export const CategorySchema = new Schema({
    name:  { type: String, unique: true, required: [ true, 'El nombre es obligatorio' ] },
    state: { type: Boolean,  default: true, required: true },
    user:  { type: Schema.Types.ObjectId, ref: 'User', required: true }
});
// -----------------------------------------------------
CategorySchema.methods.toJSON = function (){
    const { __v, _id, state, ...data } = this.toObject();
    
    return { uid: _id, ...data };
}
// -----------------------------------------------------

export default model( 'Category', CategorySchema );
