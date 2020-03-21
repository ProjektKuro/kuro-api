import { Schema, model, Model, Document } from 'mongoose';

interface IShop extends Document {
  name: string;
  latitude: number;
  longitude: number;
}
interface IShopModel extends Model<IShop> {
}

/**
 * Database definition for the `Shop` relation
 * 
 * @number  _id         the unique identifying number of the user
 * @string  name        the first name of the user(profile)
 * @number  latitude    the last name of the user(profile)
 * @number  longitude   timestamp of the creation
 * @array   products    array of products from this shop
 * @string  createdAt   timestamp of the creation
 * @string  updatedAt   timestamp of the last update
 * 
 */
var ShopSchema = new Schema({
  name: String,
  latitude: Number,
  longitude: Number,
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true });

export default model<IShop, IShopModel>('Shop', ShopSchema);
