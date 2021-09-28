const Review=require('../models/review');
const Campground = require('../models/campground');

module.exports.postReviews=async(req,res)=>{

    const{id}=req.params;
    const campground=await Campground.findById(id);
    const {rating,body}=req.body;
    const review= await new Review(req.body);
    // res.send(req.body.body);
    review.author=req.user.id;
    
        campground.reviews.push(review);
        await review.save();
        await campground.save();

        req.flash('success',"added a review");
        
    res.redirect(`/campgrounds/${campground.id}`)
       
    
    }

    module.exports.deleteReviews=async(req,res)=>{
        // res.send('deleted');
        const{id,reviewId}=req.params;
        //agar hum sirf review ko delete karenge toh wo webpage se toh delete ho jaega but agar hum mongo shell mai dekhenge
        //toh wo campgrounds ke reviews array mai uska id abhi bhi rahega
        //isliye jab bhi hum idhar koi bhi reviews ko delete krenge toh usko campgrounds ke reviews array mai se bhi delete karna hoga
    
        //pull operator->ye pull ka use kisi bhi array mai se koi bhi element delete krne ke liye hota hai
        //idhar ye phle ek campground khoj raha hai jiska id (id) hai
        //uske bad-- pull opeartor ke use krke hum reviews array mai se kuch delete karenge
        //ab ye pull operator idhar campground ke reviews array mai se jiska bhi id reviewId hai usko delete kar dega
        await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash('success',"deleted a review");
        res.redirect(`/campgrounds/${id}`);
    
    
    }