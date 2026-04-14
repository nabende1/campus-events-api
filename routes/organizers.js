const router = require('express').Router();
const organizersController = require('../controllers/organizers');

// #swagger.tags = ['Organizers']
router.get('/', organizersController.getAll);

// #swagger.tags = ['Organizers']
router.get('/:id', organizersController.getSingle);

// #swagger.tags = ['Organizers']
// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Organizer' } }
router.post('/', organizersController.create);

// #swagger.tags = ['Organizers']
// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Organizer' } }
router.put('/:id', organizersController.update);

// #swagger.tags = ['Organizers']
router.delete('/:id', organizersController.remove);

module.exports = router;
