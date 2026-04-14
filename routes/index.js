const router = require('express').Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Campus Events API is running',
    endpoints: {
      events: ['GET /events', 'GET /events/:id', 'POST /events', 'PUT /events/:id', 'DELETE /events/:id'],
      organizers: [
        'GET /organizers',
        'GET /organizers/:id',
        'POST /organizers',
        'PUT /organizers/:id',
        'DELETE /organizers/:id'
      ]
    }
  });
});

router.use('/events', require('./events'));
router.use('/organizers', require('./organizers'));

module.exports = router;
