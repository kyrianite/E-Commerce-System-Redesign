require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');

const credentials = {
  user: process.env.PG_USER,
  host: 'localhost',
  database: process.env.PG_DB,
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
  const loadProducts = `COPY products FROM '/tmp/product.csv' WITH DELIMITER ',' NULL AS 'null' CSV HEADER`;
  const loadReviews = `COPY reviews FROM '/tmp/reviews.csv' WITH DELIMITER ',' NULL AS 'null' CSV HEADER`;
  const loadReviewsPhotos = `COPY reviews_photos FROM '/tmp/reviews_photos.csv' WITH DELIMITER ',' NULL AS 'null' CSV HEADER`;
  const loadCharacteristics = `COPY characteristics FROM '/tmp/characteristics.csv' WITH DELIMITER ',' NULL AS 'null' CSV HEADER`;
  const loadCharacteristicReviews = `COPY characteristic_reviews FROM '/tmp/characteristic_reviews.csv' WITH DELIMITER ',' NULL AS 'null' CSV HEADER`;

  console.log('Loading Products...');
  console.time();
  await client.query(loadProducts);
  console.timeEnd();

  console.log('Loading Reviews...');
  console.time();
  await client.query(loadReviews);
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
  // await loadSchema();
  // await loadData();
  await closeDB();
})();
