
// -----------------------------------------------------
/**
 * Change the `_id` field name for `uid`.
 * 
 * @param doc An object of type any witch correspond to
 * a Mongoose Model
 * @returns A new model with the `_id` field change to `uid`
 */
export const transformUid = ( doc: any ) => {
    const { _id, ...data } = doc._doc;
    
    return { uid: _id, ...data };
}
// -----------------------------------------------------