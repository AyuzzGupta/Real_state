const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { protect } = require('../middleware/auth');

router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getProperty);
router.post('/:id/favorite', protect, propertyController.toggleFavorite);
router.post('/:id/inquiry', propertyController.submitInquiry);

module.exports = router;
