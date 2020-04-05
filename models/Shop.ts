import { Schema, model, Model, Document } from 'mongoose';
import mongoose from 'mongoose';

interface IShop extends Document {
  name: string;
  location: any;
  products: any[];
  stock: any[];
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
  stock: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number },
    updatedAt: { type: Date, default: Date.now }
  }],
  address: { type: Schema.Types.ObjectId, ref: 'Address' },
}, { timestamps: true, usePushEach: true });

ShopSchema.index({ location: "2dsphere" });

ShopSchema.post('find', softDeleteMiddleware);
ShopSchema.post('findOne', softDeleteMiddleware);

const ObjectId = mongoose.Types.ObjectId;

function softDeleteMiddleware(document, next) {
  // If `isDeleted` is not set on the query, set it to `false` so we only
  // get docs that haven't been deleted by default
  var _that = this;
  // console.log(document.stock)
  model<IShop, IShopModel>('Shop', ShopSchema).aggregate([
    { $match: { _id: ObjectId(_that.getQuery()._id) } },
    { $unwind: "$stock" },
    {
      $group: {
        _id: "$stock.product",
        numerator: {
          $sum: {
            // e ^ ( -x / 4 )
            $multiply: [
              {
                $exp: {
                  // Stunde durch delta Zeit: "1/x" oder so ähnlich
                  $divide: [
                    // delta TIME
                    { $divide: [{ $subtract: ["$stock.updatedAt", new Date()] }, 3600000] },
                    7
                  ]
                }
              },
              "$stock.quantity"
            ]
          }
        },
        denominator: { $sum: 1 },
        timestamp: { $max: "$stock.updatedAt" }
      }
    },
    {
      $project: {
        product: "$_id",
        quantity: { $divide: ["$numerator", "$denominator"] },
        updatedAt: "$timestamp"
      }
    }
  ], (_, data) => {
    document.stock = data;
    next()
  });
}

export default model<IShop, IShopModel>('Shop', ShopSchema);
