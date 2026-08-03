const Property = require('../models/Property');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Setup multer for image upload
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if(mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
});

exports.uploadPropertyImages = upload.array('images', 5);

// Helper to fetch current user's favorite IDs array
async function getUserFavoriteIds(req) {
    if (!req.session.user) return [];
    try {
        const user = await User.findById(req.session.user.id).select('favorites');
        return user && user.favorites ? user.favorites.map(id => id.toString()) : [];
    } catch (e) {
        return [];
    }
}

// API/Controller methods
exports.getAllProperties = async (req, res) => {
    try {
        let query = {};
        
        // Search & Filters
        if (req.query.search) {
            query.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { location: { $regex: req.query.search, $options: 'i' } },
                { category: { $regex: req.query.search, $options: 'i' } }
            ];
        }
        if (req.query.category) query.category = req.query.category;
        if (req.query.minPrice) query.price = { ...query.price, $gte: Number(req.query.minPrice) };
        if (req.query.maxPrice) query.price = { ...query.price, $lte: Number(req.query.maxPrice) };
        if (req.query.bedrooms) query.bedrooms = Number(req.query.bedrooms);

        let sortBy = '-createdAt';
        if (req.query.sort === 'cheapest') sortBy = 'price';
        if (req.query.sort === 'expensive') sortBy = '-price';

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 6;
        const startIndex = (page - 1) * limit;
        const total = await Property.countDocuments(query);

        const properties = await Property.find(query)
            .sort(sortBy)
            .skip(startIndex)
            .limit(limit);

        const userFavorites = await getUserFavoriteIds(req);

        const breadcrumbs = [
            { title: 'Home', url: '/' },
            { title: 'Properties', url: '/properties' }
        ];

        res.render('pages/properties', {
            pageTitle: 'Property Listings',
            properties,
            total,
            page,
            pages: Math.ceil(total / limit),
            query: req.query,
            userFavorites,
            breadcrumbs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.getProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('owner', 'fullName email phone');
        if (!property) {
            return res.status(404).render('pages/404', { pageTitle: 'Property Not Found' });
        }
        
        const related = await Property.find({
            category: property.category,
            _id: { $ne: property._id }
        }).limit(3);

        const userFavorites = await getUserFavoriteIds(req);
        const isFavorite = userFavorites.includes(property._id.toString());

        const breadcrumbs = [
            { title: 'Home', url: '/' },
            { title: 'Properties', url: '/properties' },
            { title: property.title, url: null }
        ];

        res.render('pages/property-details', {
            pageTitle: property.title,
            property,
            related,
            userFavorites,
            isFavorite,
            breadcrumbs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Toggle property favorite status
exports.toggleFavorite = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized. Please login.' });
        }

        const userId = req.session.user.id;
        const propertyId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const favIndex = user.favorites.indexOf(propertyId);
        let isFavorite = false;

        if (favIndex > -1) {
            user.favorites.splice(favIndex, 1);
            isFavorite = false;
        } else {
            user.favorites.push(propertyId);
            isFavorite = true;
        }

        await user.save();

        res.json({
            success: true,
            isFavorite,
            favoritesCount: user.favorites.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get User Favorites Page
exports.getFavoritesPage = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const user = await User.findById(req.session.user.id).populate('favorites');
        const favorites = user ? user.favorites : [];
        const userFavorites = favorites.map(p => p._id.toString());

        const breadcrumbs = [
            { title: 'Home', url: '/' },
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'My Favourites', url: '/favorites' }
        ];

        res.render('pages/dashboard', {
            pageTitle: 'My Favourites',
            activeTab: 'favorites',
            favorites,
            userFavorites,
            breadcrumbs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Submit property inquiry / schedule visit
exports.submitInquiry = async (req, res) => {
    try {
        const { propertyId, inquiryType, message, visitDate } = req.body;
        // Simulating saved inquiry response
        res.json({
            success: true,
            message: inquiryType === 'visit' 
                ? `Visit successfully scheduled for ${visitDate || 'the selected date'}! Owner will contact you shortly.` 
                : 'Your message has been sent to the property owner!'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to process request.' });
    }
};

exports.createProperty = async (req, res) => {
    try {
        req.body.owner = req.session.user.id;
        
        if (req.files && req.files.length > 0) {
            req.body.images = req.files.map(file => `/uploads/${file.filename}`);
        }

        await Property.create(req.body);
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.deleteProperty = async (req, res) => {
    try {
        await Property.findByIdAndDelete(req.params.id);
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
