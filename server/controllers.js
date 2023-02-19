/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
/* eslint-disable quotes */
/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  host: 'localhost',
  database: process.env.PG_DB,
  // database: 'sdc_mini',
  password: process.env.PG_PASS,
  port: process.env.PG_PORT,
});

const validReviewRequest = (req) => {
  const { page, count, product_id, sort } = req;
  if (!Number.isInteger(+page) || !Number.isInteger(+count) || !Number.isInteger(+product_id)) {
    return false;
  }
  if (sort === 'newest' || sort === 'helpful' || sort === 'relevant') {
    return true;
  }
  return false;
};

const validPost = (post) => {
  if (typeof post.product_id !== 'number' || typeof post.rating !== 'number' || typeof post.summary !== 'string' || typeof post.body !== 'string') {
    return false;
  }
  if (typeof post.recommend !== 'boolean' || typeof post.name !== 'string' || typeof post.email !== 'string' || !Array.isArray(post.photos) || typeof post.characteristics !== 'object') {
    return false;
  }
  if (!Number.isInteger(post.product_id) || !Number.isInteger(post.rating) || post.rating < 1 || post.rating > 5) {
    return false;
  }
  const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!post.email.match(validEmailRegex)) {
    return false;
  }

  return true;
};

module.exports = {
  getReviews: async (req, res) => {
    try {
      let { page, count } = req.query;
      const { sort, product_id } = req.query;
      if (page === undefined) { page = 1; }
      if (count === undefined) { count = 5; }
      const offset = (page - 1) * count;

      if (!validReviewRequest(req.query)) { throw Error; }
      let orderBy = 'helpfulness DESC';
      if (sort === 'newest') { orderBy = 'date DESC'; }
      if (sort === 'relevant') { orderBy = 'rating DESC'; }

      const mainInfo = await pool.query(`SELECT * FROM reviews WHERE product_id=${product_id} AND REPORTED=false ORDER BY ${orderBy} LIMIT ${count} OFFSET ${offset}`);
      res.status(200).json(mainInfo.rows);
    } catch (err) {
      res.status(500).send();
    }
  },
  getMetaData: async (req, res) => {
    const { product_id } = req.query;
    try {
      if (Number.isNaN(product_id)) { throw Error; }

      const recommendsQuery = await pool.query(`SELECT recommend, COUNT (recommend) FROM reviews WHERE product_id=${product_id} GROUP BY recommend`);
      const recommended = {};
      recommendsQuery.rows.forEach((row) => {
        if (row.recommend === false) {
          recommended[0] = +row.count;
        } else {
          recommended[1] = +row.count;
        }
      });

      const ratingsQuery = await pool.query(`SELECT rating, COUNT (rating) FROM reviews WHERE product_id=${product_id} GROUP BY rating`);
      const ratings = {};
      ratingsQuery.rows.forEach((row) => {
        ratings[row.rating] = +row.count;
      });
      for (let i = 1; i < 6; i++) {
        if (!ratings[i]) {
          ratings[i] = 0;
        }
      }

      const characteristicsQuery = await pool.query(`SELECT name, value FROM characteristics INNER JOIN characteristic_reviews ON characteristics.id=characteristic_reviews.characteristic_id where product_id=${product_id}`);
      const characteristics = {};
      const characteristicsSizes = {};
      characteristicsQuery.rows.forEach((row) => {
        if (!characteristics[row.name]) {
          characteristics[row.name] = row.value;
          characteristicsSizes[row.name] = 1;
        } else {
          characteristics[row.name] += row.value;
          characteristicsSizes[row.name] += 1;
        }
      });
      for (const c in characteristics) {
        characteristics[c] = (characteristics[c] / characteristicsSizes[c]).toFixed(4);
      }

      const data = { product_id, ratings, recommended, characteristics };
      res.status(200).json(data);
    } catch (err) {
      res.status(500).send();
    }
  },
  postReview: async (req, res) => {
    const { product_id, rating, summary, body, recommend, name, email, characteristics } = req.body;
    const date = (new Date()).toISOString();
    let { photos } = req.body;
    photos = photos.map((p, i) => ({ id: i + 1, url: p }));
    photos = JSON.stringify(photos);
    try {
      if (!validPost(req.body)) { throw Error; }
      const newPost = `INSERT INTO reviews VALUES (DEFAULT, ${product_id}, ${rating}, '${date}', '${summary}', '${body}', ${recommend}, false, '${name}', '${email}', null, 0, '${photos}')`;
      const reviewIDQuery = await pool.query(`SELECT MAX(id) FROM reviews`);
      const reviewID = reviewIDQuery.rows[0].max;
      await pool.query(newPost);
      for (const c in characteristics) {
        await pool.query(`INSERT INTO characteristic_reviews VALUES (DEFAULT, ${c}, ${reviewID}, ${characteristics[c]})`);
      }
      res.status(201).send();
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  },
  markHelpful: async (req, res) => {
    const reviewId = req.params.review_id;
    console.log('reviewId', reviewId);
    try {
      await pool.query(`UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id=${reviewId}`);
      res.status(204).send();
    } catch (err) {
      res.status(500).send();
    }
  },
  reportReview: async (req, res) => {
    const reviewId = req.params.review_id;
    try {
      await pool.query(`UPDATE reviews SET reported = true WHERE id=${reviewId}`);
      res.status(204).send();
    } catch (err) {
      res.status(500).send();
    }
  },
};
