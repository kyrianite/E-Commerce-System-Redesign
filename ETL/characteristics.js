const fs = require('fs');
const csv = require('csv-parser');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const { Transform } = require('stream').Transform;

const csvStringifier = createCsvStringifier({
  header: [
    { id: 'id', title: 'id' },
    { id: 'product_id', title: 'product_id' },
    { id: 'name', title: 'name' }],
});

const transformer = new Transform({
  objectMode: true,
  transform(chunk, encoding, cb) {
    // transform chunk
    cb();
  },
});

const readStream = fs.createReadStream('/tmp/characteristics_mini.csv');
const writeStream = fs.createWriteStream('/tmp/characteristics_mini_clean.csv');

writeStream.write(csvStringifier.getHeaderString());
readStream
  .pipe(csv())
  .pipe(transformer)
  .pipe(writeStream)
  .on('finish', () => { console.log('Finished transforming characteristics csv'); });
