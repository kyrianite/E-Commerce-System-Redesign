/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  host: 'localhost',
  // database: process.env.PG_DB,
  database: 'sdc_mini',
  password: process.env.PG_PASS,
  port: process.env.PG_PORT,
});

const validReviewRequest = (req) => {
  const { page, count, product_id } = req;
  const sort = req.sort.slice(1, req.sort.length - 1); // remove double string quotes
  if (Number.isNaN(page) || Number.isNaN(count) || Number.isNaN(product_id)) {
    return false;
  }
  if (sort === 'newest' || sort === 'helpful' || sort === 'relevant') {
    return true;
  }
  return false;
};

const formatReviewResults = (res) => {

};

module.exports = {
  getReviews: async (req, res) => {
    try {
      let { page, count } = req.query;
      const { sort, product_id } = req.query;
      if (page === undefined) { page = 1; }
      if (count === undefined) { count = 5; }
      if (!validReviewRequest(req.query)) { throw Error; }
      const mainInfo = await pool.query(`SELECT * FROM reviews WHERE product_id=${product_id} AND REPORTED=false ORDER BY helpfulness DESC`);
      console.log(mainInfo.rows);
      res.status(200).json(mainInfo.rows);
    } catch (err) {
      res.status(500).send();
    }
  },
  getMetaData: async (req, res) => {
    try {
      const info = await pool.query('test statement');
      res.status(200).json(info);
    } catch (err) {
      res.status(500).send();
    }
  },
  postReview: async (req, res) => {
    try {
      await pool.query('test statement');
      res.status(201).send();
    } catch (err) {
      res.status(500).send();
    }
  },
  markHelpful: async (req, res) => {
    const reviewId = req.params.review_id;
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
