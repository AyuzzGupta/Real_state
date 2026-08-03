// Authentication Middleware
exports.protect = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user || !roles.includes(req.session.user.role)) {
            return res.status(403).render('pages/404', { pageTitle: 'Access Denied', message: 'You do not have permission to perform this action' });
        }
        next();
    };
};
