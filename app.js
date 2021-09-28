if(process.env.NODE_ENV!=="production")
{
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { campgroundSchema,reviewSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const joi = require('joi');
const User=require('./models/users');
//passport
const passport=require('passport');
const passportLocal=require('passport-local');

//flash
const flash=require('connect-flash')

//routers
const campgroundRoutes=require('./routes/campgrounds')
const reviewsRoutes=require('./routes/reviews')
const usersRoutes=require('./routes/users');

//sessions
const session=require('express-session');
const sessionOption={
    secret:'thisshouldbeagoodsecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires: Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7,

        
    }

};

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});



//ejs-mate
app.engine('ejs', ejsMate)

//views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//flash
app.use(flash());
//sessions
app.use(session(sessionOption));

//public
app.use(express.static(path.join(__dirname, 'public')))


//all the app.use(passport) shpould come before universal middleware i.e app.use
//and in this case before app.use(in which res.locals)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//to use the flashat any template ,, so no need to pass it every time now
//it should be above the router of the campground and reviews
app.use((req,res,next)=>{
    //passport method to check if we are logged in or not
    //it is in app.use so in every route it can check wheteher we are logged in or not
    res.locals.currentUser=req.user;
    res.locals.messages=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})
//passport
//this should always come after app.use(session)

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));



//to use all the routes of the campgrounds
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewsRoutes);
app.use('/',usersRoutes);



app.post('/', async (req, res) => {

const {user,campname}=req.body;
console.log(user,campname);
if( user && !campname)
{
    let author= await User.find({"username":{$regex:user}});
    let camps=await Campground.find({"author":author});
    res.render('home',{camps})
}
if(!user &&campname)
{
    let camps=await Campground.find({"title":{$regex:campname}});
    res.render('home',{camps})

}
});





//handling errors in creating new campground
// Now that we wrapped all our async functions in catchAsync, we can throw errors as catch block in catchAsync will catch it and pass it to next.

// Previously when colt mentioned about throwing errors, we didn't implement catchAsync that would catch errors in the async functions.

// It may cause issue if we throw errors in a async function without a catch block.

// So with catchAsync wrapping the async function, it is possible to throw new errors.






//here order matters, it will run if none of the above path matched
//http://localhost:3000/sjvsjs
app.all('*', (req, res, next) => {
    next(new ExpressError('page not found!!!', 404))
})

app.use((err, req, res, next) => {
    const { status = 500, message = "unknown" } = err;
    res.status(status).render('error', { err })
    // res.send('something is wrong new');
})


app.listen(3000, () => {
    console.log('Serving on port 3000')
})