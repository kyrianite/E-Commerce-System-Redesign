// data is located in /tmp/fileName.csv
const fs = require('fs');
const csv = require('csv-parser');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const { Transform } = require('stream');

const csvStringifier = createCsvStringifier({
  header: [
    { id: 'id', title: 'id' },
    { id: 'review_id', title: 'review_id' },
    { id: 'url', title: 'url' }],
});
const transformer = new Transform({
  objectMode: true,
  transform(chunk, encoding, cb) {
    // transform chunk
    cb();
  },
});

const readStream = fs.createReadStream('/tmp/reviews_photos_mini.csv');
const writeStream = fs.createWriteStream('/tmp/reviews_photos_mini_clean.csv');

writeStream.write(csvStringifier.getHeaderString());
readStream
  .pipe(csv())
  .pipe(transformer)
  .pipe(writeStream)
  .on('finish', () => { console.log('Finished transforming reviews photos csv'); });
