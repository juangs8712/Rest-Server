
import { Schema, model } from 'mongoose';

// -----------------------------------------------------
export const ProductSchema = new Schema({
    name:        { type: String, unique: true, required: [ true, 'El nombre es obligatorio' ] },
    state:       { type: Boolean, default: true, required: true },
    price:       { type: Number, default: 0 },
    user:        { type: Schema.Types.ObjectId, ref: 'User',   required: true },
    category:    { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String },
    available:   { type: Boolean, default: true },
    img:         { type: String },
});
// -----------------------------------------------------
ProductSchema.methods.toJSON = function (){
    const { __v, _id,  state, ...data } = this.toObject();
    
    return { uid : _id, ...data };
}
// -----------------------------------------------------

export default model( 'Product', ProductSchema );
