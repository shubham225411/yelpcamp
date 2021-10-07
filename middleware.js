
const ExpressError = require('./utils/ExpressError');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //store the url they were requesting
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}



