const express = require('express');
const {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getTemplatesByCategory,
  searchTemplates
} = require('../controllers/templateController');

const router = express.Router();

// Import middleware for protected routes and admin access
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.route('/')
  .get(getTemplates);

router.route('/search')
  .get(searchTemplates);

router.route('/category/:category')
  .get(getTemplatesByCategory);

router.route('/:id')
  .get(getTemplateById);

// Protected routes (require authentication)
router.use(protect);

// Admin only routes
router.use(authorize('admin'));

router.route('/')
  .post(createTemplate);

router.route('/:id')
  .put(updateTemplate)
  .delete(deleteTemplate);

module.exports = router;
