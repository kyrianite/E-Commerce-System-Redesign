// data is located in /tmp/fileName.csv
const fs = require('fs');
const csv = require('csv-parser');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const { Transform } = require('stream');

const csvStringifier = createCsvStringifier({
  header: [
    { id: 'id', title: 'id' },
    { id: 'product_id', title: 'product_id' },
    { id: 'rating', title: 'rating' },
    { id: 'date', title: 'date' },
    { id: 'summary', title: 'summary' },
    { id: 'body', title: 'body' },
    { id: 'recommend', title: 'recommend' },
    { id: 'reported', title: 'reported' },
    { id: 'reviewer_name', title: 'reviewer_name' },
    { id: 'reviewer_email', title: 'reviewer_email' },
    { id: 'response', title: 'response' },
    { id: 'helpfulness', title: 'helpfulness' }],
});
const transformer = new Transform({
  objectMode: true,
  transform(chunk, encoding, cb) {
    // transform chunk
    cb();
  },
});

const readStream = fs.createReadStream('/tmp/reviews_mini.csv');
const writeStream = fs.createWriteStream('/tmp/reviews_mini_clean.csv');

writeStream.write(csvStringifier.getHeaderString());
readStream
  .pipe(csv())
  .pipe(transformer)
  .pipe(writeStream)
  .on('finish', () => { console.log('Finished transforming reviews csv'); });
