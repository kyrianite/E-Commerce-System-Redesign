const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

async function main() {
  await mongoose.connect('mongodb://localhost/sdc');
  console.log('Connected!');

  const reviewsListSchema = mongoose.Schema({
    product: { type: Number, unique: true, upsert: true },
    page: Number,
    count: Number,
    results: Array, // of review_ids
  });
  const ReviewsListModel = mongoose.model('Reviews_List', reviewsListSchema);
  const reviewsListDoc = new ReviewsListModel();
  await reviewsListDoc.save();

  const reviewSchema = mongoose.Schema({
    review_id: { type: mongoose.Types.ObjectId, unique: true, upsert: true },
    product_id: Number,
    rating: Number,
    summary: String,
    recommended: Boolean,
    response: String,
    body: String,
    date: Date,
    reviewer_name: String,
    reviewer_email: String,
    helpfulness: Number,
    reported: Boolean,
    photos: Array, // of objs with properties id & url
    characteristics: Object, // keys = characteristic_id, vales = review val
  });
  const ReviewModel = mongoose.model('Review', reviewSchema);
  const reviewDoc = new ReviewModel();
  await reviewDoc.save();

  const metaDataSchema = mongoose.Schema({
    product_id: { type: mongoose.Types.ObjectId, unique: true, upsert: true },
    ratings: Object,
    recommended: Object,
    Characteristics: Object,
  });
  const MetaDataModel = mongoose.model('MetaData', metaDataSchema);
  const metaDataDoc = new MetaDataModel();
  await metaDataDoc.save();

  const characteristicsSchema = mongoose.Schema({
    review_id: { type: Number, unique: true },
  });
  const CharacteristicsModel = mongoose.model('Characteristics', characteristicsSchema);
  const characteristicsDoc = new CharacteristicsModel();
  await characteristicsDoc.save();
}

main().catch((err) => console.log(err));

console.log('Done loading schemas!');
mongoose.connection.close();
