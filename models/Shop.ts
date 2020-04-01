import { Schema, model, Model, Document } from 'mongoose';

interface IShop extends Document {
  name: string;
  location: any;
  products: any[];
  address: any;
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
  name: { type: String, text: true },
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  address: { type: Schema.Types.ObjectId, ref: 'Address' },
}, { timestamps: true, usePushEach: true });

ShopSchema.index({ location: "2dsphere" });

export default model<IShop, IShopModel>('Shop', ShopSchema);
