/* eslint-disable quotes */
require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const csv = require('csv-parser');

const credentials = {
  user: process.env.PG_USER,
  host: 'localhost',
  // database: process.env.PG_DB,
  database: 'sdc_mini',
  password: process.env.PG_PASS,
  port: process.env.PG_PORT,
};

const client = new Client(credentials);

async function connectDB() {
  await client.connect();
  console.log('Connected to PG DB!');
}

async function closeDB() {
  await client.end();
  console.log('Closed connection to PG DB!');
}

async function loadSchema() {
  const sql = fs.readFileSync('db/pgSchema.sql', 'utf8');
  await client.query(sql);
  console.log('Loaded schema!');
}

async function loadData() {
  const loadProducts = `COPY products FROM '/tmp/product_mini.csv' WITH DELIMITER ',' NULL AS 'null' CSV HEADER`;
  const loadReviews = `COPY reviews (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM '/tmp/reviews_mini_clean.csv' WITH DELIMITER ',' NULL AS 'null' CSV HEADER`;
  const loadReviewsPhotos = `COPY reviews_photos FROM '/tmp/reviews_photos_mini.csv' WITH DELIMITER ',' NULL AS 'null' CSV HEADER`;
  const loadCharacteristics = `COPY characteristics FROM '/tmp/characteristics_mini.csv' WITH DELIMITER ',' NULL AS 'null' CSV HEADER`;
  const loadCharacteristicReviews = `COPY characteristic_reviews FROM '/tmp/characteristic_reviews_mini.csv' WITH DELIMITER ',' NULL AS 'null' CSV HEADER`;

  console.log('Loading Products...');
  console.time();
  await client.query(loadProducts);
  console.timeEnd();

  console.log('Loading Reviews...');
  console.time();
  await client.query(loadReviews);
  await client.query(`UPDATE reviews SET photos = COALESCE(photos, '[]'::JSONB)`);
  await fs.createReadStream('/tmp/reviews_photos_mini.csv')
    .pipe(csv())
    .on('data', async (data) => {
      // let pIndex = await client.query(`SELECT jsonb_array_length(photos) FROM reviews WHERE id=${data.review_id}`);
      // pIndex = pIndex.rows[0].jsonb_array_length + 1;
      await client.query(`UPDATE reviews SET photos = photos || '{"id": ${data.id}, "url": "${data.url}"}'::JSONB WHERE id=${data.review_id}`);
    });
  console.timeEnd();

  console.log('Loading Reviews Photos...');
  console.time();

  await client.query(loadReviewsPhotos);
  console.timeEnd();

  console.log('Loading Characteristics...');
  console.time();
  await client.query(loadCharacteristics);
  console.timeEnd();

  console.log('Loading Characteristic Reviews...');
  console.time();
  await client.query(loadCharacteristicReviews);
  console.timeEnd();

  console.log('Loaded All CSV Data!');
}

// test functionality
(async () => {
  await connectDB();
  await loadSchema();
  await loadData();
  await closeDB();
})();
