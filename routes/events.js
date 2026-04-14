const router = require('express').Router();
const eventsController = require('../controllers/events');

// #swagger.tags = ['Events']
router.get('/', eventsController.getAll);

// #swagger.tags = ['Events']
router.get('/:id', eventsController.getSingle);

// #swagger.tags = ['Events']
// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Event' } }
router.post('/', eventsController.create);

// #swagger.tags = ['Events']
// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Event' } }
router.put('/:id', eventsController.update);

// #swagger.tags = ['Events']
router.delete('/:id', eventsController.remove);

module.exports = router;
