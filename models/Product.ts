import { Schema, model, Model, Document } from 'mongoose';

interface IProduct extends Document {
  name: string;
  description: string;
  quantity: number;
  shops: any[];
  categories: any[];
}
interface IProductModel extends Model<IProduct> {
}

/**
 * Database definition for the `Product` relation
 * 
 * @number  _id             the unique identifying number of the product
 * @string  name            human readable name of the product
 * @string  description     description of the product, used to better describe the goods to the user
 * @array   shops           array of shops where the product is available
 * @array   categories      array of categories for this product
 * @string  createdAt       timestamp of the creation
 * @string  updatedAt       timestamp of the last update
 * 
 */
var ProductSchema = new Schema({
  name: { type: String, text: true },
  description: { type: String, text: true },
  quantity: Number,
  categories: [{ type: String, text: true }],
}, { timestamps: true, usePushEach: true });

export default model<IProduct, IProductModel>('Product', ProductSchema);
