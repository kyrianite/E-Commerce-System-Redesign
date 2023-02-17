const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  host: 'localhost',
  database: process.env.PG_DB,
  password: process.env.PG_PASS,
  port: process.env.PG_PORT,
});

module.exports = {
  getReviews: async (req, res) => {
    try {
      const info = await pool.query('test statement');
      res.status(200).json(info);
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
    console.log('reviewId to mark helpful: ', reviewId);
    try {
      const review = pool.query(`UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id=${reviewId}`);
      console.log(review.rows);
      res.status(204).send();
    } catch (err) {
      res.status(500).send();
    }
  },
  reportReview: async (req, res) => {
    const reviewId = req.params.review_id;
    console.log('reviewId to report: ', reviewId);
    try {
      const review = pool.query(`UPDATE reviews SET reported = true WHERE id=${reviewId}`);
      console.log(review.rows);
      res.status(204).send();
    } catch (err) {
      res.status(500).send();
    }
  }
};
