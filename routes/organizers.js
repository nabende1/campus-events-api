const router = require('express').Router();
const organizersController = require('../controllers/organizers');
const { ensureAuthenticated } = require('../middleware/auth');

// #swagger.tags = ['Organizers']
router.get('/', organizersController.getAll);

// #swagger.tags = ['Organizers']
router.get('/:id', organizersController.getSingle);

// #swagger.tags = ['Organizers']
// #swagger.security = [{ OAuth2: [] }]
// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Organizer' } }
router.post('/', ensureAuthenticated, organizersController.create);

// #swagger.tags = ['Organizers']
// #swagger.security = [{ OAuth2: [] }]
// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Organizer' } }
router.put('/:id', ensureAuthenticated, organizersController.update);

// #swagger.tags = ['Organizers']
router.delete('/:id', organizersController.remove);

module.exports = router;
