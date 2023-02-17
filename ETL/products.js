// data is located in /tmp/fileName.csv
const fs = require('fs');
const csv = require('csv-parser');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const { Transform } = require('stream').Transform;

const csvStringifier = createCsvStringifier({
  header: [
    { id: 'id', title: 'id' },
    { id: 'name', title: 'name' },
    { id: 'slogan', title: 'slogan' },
    { id: 'description', title: 'description' },
    { id: 'category', title: 'category' },
    { id: 'default_price', title: 'default_price' }],
});
const transformer = new Transform({
  objectMode: true,
  transform(chunk, encoding, cb) {
    // transform chunk
    cb();
  },
});

const readStream = fs.createReadStream('/tmp/product_mini.csv');
const writeStream = fs.createWriteStream('/tmp/product_mini_clean.csv');

writeStream.write(csvStringifier.getHeaderString());
readStream
  .pipe(csv())
  .pipe(transformer)
  .pipe(writeStream)
  .on('finish', () => { console.log('Finished transforming product csv'); });
