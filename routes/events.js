const router = require('express').Router();
const eventsController = require('../controllers/events');
const { ensureAuthenticated } = require('../middleware/auth');

// #swagger.tags = ['Events']
router.get('/', eventsController.getAll);

// #swagger.tags = ['Events']
router.get('/:id', eventsController.getSingle);

// #swagger.tags = ['Events']
// #swagger.security = [{ OAuth2: [] }]
// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Event' } }
router.post('/', ensureAuthenticated, eventsController.create);

// #swagger.tags = ['Events']
// #swagger.security = [{ OAuth2: [] }]
// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Event' } }
router.put('/:id', ensureAuthenticated, eventsController.update);

// #swagger.tags = ['Events']
router.delete('/:id', eventsController.remove);

module.exports = router;
