const User = require('../models/User');

exports.registerUser = async (req, res) => {
    try {
        const { fullName, email, phone, password, confirmPassword } = req.body;

        // Validation
        if (password !== confirmPassword) {
            return res.render('pages/register', { error: 'Passwords do not match', pageTitle: 'Register' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.render('pages/register', { error: 'Email already registered', pageTitle: 'Register' });
        }

        const user = await User.create({
            fullName,
            email,
            phone,
            password
        });

        // Auto login after register
        req.session.user = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        };
        res.redirect('/dashboard');
    } catch (error) {
        res.render('pages/register', { error: error.message, pageTitle: 'Register' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render('pages/login', { error: 'Please provide email and password', pageTitle: 'Login' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return res.render('pages/login', { error: 'Invalid credentials', pageTitle: 'Login' });
        }

        req.session.user = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        };
        
        if (user.role === 'admin') {
            return res.redirect('/admin/dashboard');
        }
        res.redirect('/dashboard');
    } catch (error) {
        res.render('pages/login', { error: error.message, pageTitle: 'Login' });
    }
};

exports.logoutUser = (req, res) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
};
