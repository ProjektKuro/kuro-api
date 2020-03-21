import { Schema, model, Model, Document } from 'mongoose';

interface IProfile extends Document {
  name: string;
  latitude: number;
  longitude: number;
}
interface IProfileModel extends Model<IProfile> {
}

/**
 * Database definition for the `User_Profile` relation
 * 
 * @number  _id         the unique identifying number of the user
 * @string  firstname   the first name of the user(profile)
 * @string  lastname    the last name of the user(profile)
 * @string  owner       reference to the user whose profile this is
 * @string  lastLogin   timestamp of the last login of the user
 * 
 */
var ProfileSchema = new Schema({
  firstname: String,
  lastname: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  lastLogin: Date,
}, { timestamps: true });

export default model<IProfile, IProfileModel>('Profile', ProfileSchema);
