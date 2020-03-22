import { Schema, model } from 'mongoose';

var CommentSchema = new Schema({
  body: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  article: { type: Schema.Types.ObjectId, ref: 'Article' }
}, { timestamps: true });

// Requires population of author
CommentSchema.methods.toJSONFor = function (user) {
  return {
    id: this._id,
    body: this.body,
    createdAt: this.createdAt,
    author: this.author.toProfileJSONFor(user)
  };
};

model('Comment', CommentSchema);
