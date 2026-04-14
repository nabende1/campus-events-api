const router = require('express').Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Campus Events API is running',
    endpoints: {
      auth: ['GET /auth', 'GET /auth/github', 'GET /auth/github/callback', 'GET /auth/logout'],
      events: ['GET /events', 'GET /events/:id', 'POST /events', 'PUT /events/:id', 'DELETE /events/:id'],
      organizers: [
        'GET /organizers',
        'GET /organizers/:id',
        'POST /organizers',
        'PUT /organizers/:id',
        'DELETE /organizers/:id'
      ],
      venues: ['GET /venues', 'GET /venues/:id', 'POST /venues', 'PUT /venues/:id', 'DELETE /venues/:id'],
      registrations: [
        'GET /registrations',
        'GET /registrations/:id',
        'POST /registrations',
        'PUT /registrations/:id',
        'DELETE /registrations/:id'
      ]
    }
  });
});

router.use('/events', require('./events'));
router.use('/organizers', require('./organizers'));
router.use('/venues', require('./venues'));
router.use('/registrations', require('./registrations'));

module.exports = router;
