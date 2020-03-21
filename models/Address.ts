import { Schema, model } from 'mongoose';

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
}, { timestamps: true });

export default model('Address', AddressSchema);
