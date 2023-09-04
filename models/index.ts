import { model } from 'mongoose';

import { CategorySchema } from './category.js';
import { RoleSchema }     from './role.js';
import { ProductSchema }  from './product.js';
import { UserSchema }     from './user.js';

export * as Server    from './server.js';

export const Category = model( 'Category', CategorySchema );
export const Role     = model( 'Role',     RoleSchema );
export const Product  = model( 'Product',  ProductSchema );
export const User     = model( 'User',     UserSchema );
