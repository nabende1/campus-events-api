const router = require('express').Router();
const venuesController = require('../controllers/venues');
const { ensureAuthenticated } = require('../middleware/auth');

// #swagger.tags = ['Venues']
router.get('/', venuesController.getAll);

// #swagger.tags = ['Venues']
router.get('/:id', venuesController.getSingle);

// #swagger.tags = ['Venues']
// #swagger.security = [{ OAuth2: [] }]
// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Venue' } }
router.post('/', ensureAuthenticated, venuesController.create);

// #swagger.tags = ['Venues']
// #swagger.security = [{ OAuth2: [] }]
// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Venue' } }
router.put('/:id', ensureAuthenticated, venuesController.update);

// #swagger.tags = ['Venues']
router.delete('/:id', venuesController.remove);

module.exports = router;