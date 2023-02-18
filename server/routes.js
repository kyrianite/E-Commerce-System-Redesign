const router = require('express').Router();
const controller = require('./controllers');

router.get('/reviews', controller.getReviews);
router.get('/reviews/meta', controller.getMetaData);
router.post('/reviews', controller.postReview);
router.put('/reviews/:review_id/helpful', controller.markHelpful);
router.put('/reviews/:review_id/report', controller.reportReview);

module.exports = router;
