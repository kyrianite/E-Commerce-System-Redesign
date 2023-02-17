const fs = require('fs');
const csv = require('csv-parser');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const { Transform } = require('stream');

const csvStringifier = createCsvStringifier({
  header: [
    { id: 'id', title: 'id' },
    { id: 'characteristic_id', title: 'characteristic_id' },
    { id: 'review_id', title: 'review_id' },
    { id: 'value', title: 'value' }],
});

const transformer = new Transform({
  objectMode: true,
  transform(chunk, encoding, cb) {
    // transform chunk
    cb();
  },
});

const readStream = fs.createReadStream('/tmp/characteristic_reviews_mini.csv');
const writeStream = fs.createWriteStream('/tmp/characteristic_reviews_mini_clean.csv');

writeStream.write(csvStringifier.getHeaderString());
readStream
  .pipe(csv())
  .pipe(transformer)
  .pipe(writeStream)
  .on('finish', () => { console.log('Finished transforming characteristic reviews csv'); });
