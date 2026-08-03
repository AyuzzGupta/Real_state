const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const propertyController = require('../controllers/propertyController');
const { protect } = require('../middleware/auth');
const Property = require('../models/Property');
const User = require('../models/User');

// Page Routes
router.get('/', async (req, res) => {
    try {
        const featuredProperties = await Property.find().limit(3).sort('-createdAt');
        let userFavorites = [];
        if (req.session.user) {
            const dbUser = await User.findById(req.session.user.id).select('favorites');
            if (dbUser && dbUser.favorites) {
                userFavorites = dbUser.favorites.map(id => id.toString());
            }
        }
        res.render('pages/home', { pageTitle: 'Home', featuredProperties, userFavorites });
    } catch (error) {
        res.render('pages/home', { pageTitle: 'Home', featuredProperties: [], userFavorites: [] });
    }
});

router.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    res.render('pages/login', { pageTitle: 'Login', error: null });
});

router.get('/register', (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    res.render('pages/register', { pageTitle: 'Register', error: null });
});

router.get('/dashboard', protect, async (req, res) => {
    try {
        const dbUser = await User.findById(req.session.user.id).populate('favorites');
        const favorites = dbUser ? dbUser.favorites : [];
        const userFavorites = favorites.map(p => p._id.toString());
        const activeTab = req.query.tab || 'profile';

        const breadcrumbs = [
            { title: 'Home', url: '/' },
            { title: 'Dashboard', url: '/dashboard' }
        ];

        res.render('pages/dashboard', { 
            pageTitle: 'My Dashboard',
            favorites,
            userFavorites,
            activeTab,
            breadcrumbs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.get('/favorites', protect, propertyController.getFavoritesPage);

// Auth API Routes
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);

module.exports = router;
