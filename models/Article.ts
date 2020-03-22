import { Schema, Document, model } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import slug from 'slug';
var User = model('User');

export interface IArticle extends Document {
  title?: String,
  description?: String,
  body?: String,
}

var ArticleSchema = new Schema({
  slug: { type: String, lowercase: true, unique: true },
  title: String,
  description: String,
  body: String,
  favoritesCount: { type: Number, default: 0 },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  tagList: [{ type: String }],
  author: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

ArticleSchema.plugin(mongooseUniqueValidator, { message: 'is already taken' });

ArticleSchema.pre('validate', function <IArticle>(next) {
  let article = this;
  if (!article.slug) {
    this.slugify();
  }

  next();
});

ArticleSchema.methods.slugify = function () {
  this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};

ArticleSchema.methods.updateFavoriteCount = function () {
  var article = this;

  return User.count({ favorites: { $in: [article._id] } }).then(function (count) {
    article.favoritesCount = count;

    return article.save();
  });
};

ArticleSchema.methods.toJSONFor = function (user) {
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    tagList: this.tagList,
    favorited: user ? user.isFavorite(this._id) : false,
    favoritesCount: this.favoritesCount,
    author: this.author.toProfileJSONFor(user)
  };
};

model('Article', ArticleSchema);
