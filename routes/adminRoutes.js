const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Property = require('../models/Property');
const User = require('../models/User');
const propertyController = require('../controllers/propertyController');

// All admin routes are protected
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', async (req, res) => {
    try {
        const properties = await Property.find().populate('owner', 'fullName');
        const usersCount = await User.countDocuments();
        const propertiesCount = properties.length;

        const breadcrumbs = [
            { title: 'Home', url: '/' },
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Admin Dashboard', url: '/admin/dashboard' }
        ];

        res.render('admin/dashboard', { 
            pageTitle: 'Admin Dashboard',
            properties,
            stats: { users: usersCount, properties: propertiesCount },
            breadcrumbs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.post('/properties', propertyController.uploadPropertyImages, propertyController.createProperty);
router.post('/properties/:id/delete', propertyController.deleteProperty);

module.exports = router;
