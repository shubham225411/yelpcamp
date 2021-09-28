const express=require('express');
const router=express.Router({mergeParams:true});
const Review=require('../models/review')
const { reviewSchema } = require('../schemas.js');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');

const{validateReview,isLoggedIn,isAuthorReview}=require('../middleware')

const reviews=require('../controllers/reviews')




//posting reviews
//route for reviewsVVVVVVVVVVVVVVVVVVVVV
//making a post req at /campgrounds/:id/reviews
router.post('/',validateReview,isLoggedIn,catchAsync(reviews.postReviews));
    
    
    
    
    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    
    
    
    //deleeting a review here
    router.delete('/:reviewId',isLoggedIn,isAuthorReview,catchAsync(reviews.deleteReviews))

    module.exports=router;
    
    