import { Schema, model } from 'mongoose';

/**
 * Database definition for the `Shop` relation
 * 
 * @number  _id         the unique identifying number of the user
 * @string  name        the first name of the user(profile)
 * @string  latitude    the last name of the user(profile)
 * @string  longitude   timestamp of the creation
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

export default model('Shop', ShopSchema);
