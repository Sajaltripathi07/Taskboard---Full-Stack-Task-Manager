const { Router } = require('express');
const { body }   = require('express-validator');

const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');
const validate       = require('../middleware/validate');

const router = Router();

// All task routes require authentication.
router.use(authMiddleware);

const VALID_STAGES = ['TODO', 'IN_PROGRESS', 'DONE'];

// GET /api/tasks 
router.get('/', taskController.getAll);

//  POST /api/tasks 
router.post(
  '/',
  [
    body('title')
      .trim()
      .notEmpty().withMessage('Task title is required.')
      .isLength({ max: 200 }).withMessage('Title must be at most 200 characters.'),

    body('description')
      .optional()
      .trim()
      .isLength({ max: 2000 }).withMessage('Description must be at most 2000 characters.'),

    body('stage')
      .optional()
      .isIn(VALID_STAGES)
      .withMessage(`Stage must be one of: ${VALID_STAGES.join(', ')}.`),
  ],
  validate,
  taskController.create
);

//  PUT /api/tasks/:id 
router.put(
  '/:id',
  [
    body('title')
      .optional()
      .trim()
      .notEmpty().withMessage('Title cannot be empty.')
      .isLength({ max: 200 }).withMessage('Title must be at most 200 characters.'),

    body('description')
      .optional()
      .trim()
      .isLength({ max: 2000 }).withMessage('Description must be at most 2000 characters.'),

    body('stage')
      .optional()
      .isIn(VALID_STAGES)
      .withMessage(`Stage must be one of: ${VALID_STAGES.join(', ')}.`),
  ],
  validate,
  taskController.update
);

//  DELETE /api/tasks/:id 
router.delete('/:id', taskController.remove);

module.exports = router;
