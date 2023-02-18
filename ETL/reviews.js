/* eslint-disable no-param-reassign */
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
    const row = chunk;
    const unixDate = new Date(Number(chunk.date));
    row.date = unixDate.toISOString();
    cb(null, csvStringifier.stringifyRecords([row]));
  },
});

console.log('Cleaning reviews.csv to update time from UNIX to ISO...');
console.time();
const readStream = fs.createReadStream('/tmp/reviews.csv');
const writeStream = fs.createWriteStream('/tmp/reviews_clean.csv');

writeStream.write(csvStringifier.getHeaderString());
readStream
  .pipe(csv())
  .pipe(transformer)
  .pipe(writeStream)
  .on('finish', () => {
    console.timeEnd();
    console.log('Finished transforming reviews csv');
  });
