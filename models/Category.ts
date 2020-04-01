import { Schema, model, Model, Document } from 'mongoose';

interface ICategory extends Document {
  name: { type: String, text: true };
  description: { type: String, text: true };
  products: any[];
}
interface ICategoryModel extends Model<ICategory> {
}

/**
 * Database definition for the `Category` relation
 * 
 * @number  _id             the unique identifying number of the category
 * @string  name            human readable name of the category
 * @string  description     description of the category, used to better describe it to the user
 * @string  createdAt       timestamp of the creation
 * @string  updatedAt       timestamp of the last update
 * 
 */
var CategorySchema = new Schema({
  name: String,
  description: String,
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true, usePushEach: true });

export default model<ICategory, ICategoryModel>('Category', CategorySchema);
