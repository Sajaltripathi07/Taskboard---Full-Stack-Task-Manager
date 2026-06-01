const { Router } = require('express');
const { body }   = require('express-validator');

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const validate       = require('../middleware/validate');

const router = Router();

// Register
router.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required.')
      .isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters.'),

    body('email')
      .trim()
      .notEmpty().withMessage('Email is required.')
      .isEmail().withMessage('Please enter a valid email address.')
      .normalizeEmail(),

    body('password')
      .notEmpty().withMessage('Password is required.')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
      .matches(/\d/).withMessage('Password must contain at least one number.'),
  ],
  validate,
  authController.register
);

// Login
router.post(
  '/login',
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required.')
      .isEmail().withMessage('Please enter a valid email address.')
      .normalizeEmail(),

    body('password')
      .notEmpty().withMessage('Password is required.'),
  ],
  validate,
  authController.login
);

//  Current user (protected) 
router.get('/me', authMiddleware, authController.me);

module.exports = router;
