const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //store the url they were requesting
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}
module.exports.validateschema = (req, res, next) => {
    const result = campgroundSchema.validate(req.body);

    if (result.error) {
        const msg = result.error.details[0].message;
        throw new ExpressError(msg);
    }
    else {
        //if we will not include next() here , then if there is no error in validating schema then it will got stuck
        console.log('before next');
        next();
        console.log('after next');
    }

}

module.exports.isAuthor=async(req,res,next)=>{
    const{id}=req.params;
    const campground=await Campground.findById(id);
    if(!campground.author.equals(req.user.id))
    {
        req.flash('error','Not Authorized');
       return res.redirect('/campgrounds');
    }
    next();
}

module.exports.validateReview=(req,res,next)=>{
    const result=reviewSchema.validate(req.body);
    console.log(result.error);
    if (result.error) {
        const msg = result.error.details[0].message;
        
        throw new ExpressError(msg);
    }
    else {
        //if we will not include next() here , then if there is no error in validating schema then it will got stuck   
     next();
       
    }
}
module.exports.isAuthorReview=async(req,res,next)=>{
    const{id,reviewId}=req.params;
    const found=await Review.findById(reviewId);
    if(!found.author.equals(req.user.id))
    {
        req.flash('error','not authorized')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}