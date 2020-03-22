import { Schema, model, Model, Document } from 'mongoose';

interface IAddress extends Document {
  shop: any;
  address: string;
  address2: string;
  district: string;
  city: string;
  postralCode: number;
}
interface IAddressModel extends Model<IAddress> {
}

/**
 * Database definition for the `Address` relation
 * 
 * @number  _id             the unique identifying number of the address
 * @string  shop_id         foreign key of the shop
 * @string  address         the address string
 * @string  district        district name of the address
 * @string  city            city name of the address
 * @number  postralCode     the postral code associated with the address
 * @string  createdAt       timestamp of the creation
 * @string  updatedAt       timestamp of the last update
 * 
 */
var AddressSchema = new Schema({
  shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  address: String,
  address2: String,
  district: String,
  city: String,
  postralCode: Number,
}, { timestamps: true, usePushEach: true });

export default model<IAddress, IAddressModel>('Address', AddressSchema);
