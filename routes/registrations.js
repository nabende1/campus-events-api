const router = require('express').Router();
const registrationsController = require('../controllers/registrations');
const { ensureAuthenticated } = require('../middleware/auth');

// #swagger.tags = ['Registrations']
router.get('/', registrationsController.getAll);

// #swagger.tags = ['Registrations']
router.get('/:id', registrationsController.getSingle);

// #swagger.tags = ['Registrations']
// #swagger.security = [{ OAuth2: [] }]
// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Registration' } }
router.post('/', ensureAuthenticated, registrationsController.create);

// #swagger.tags = ['Registrations']
// #swagger.security = [{ OAuth2: [] }]
// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Registration' } }
router.put('/:id', ensureAuthenticated, registrationsController.update);

// #swagger.tags = ['Registrations']
router.delete('/:id', registrationsController.remove);

module.exports = router;