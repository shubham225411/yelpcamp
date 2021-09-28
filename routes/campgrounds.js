const express=require('express');
//multer
const multer  = require('multer')
const {storage}=require('../cloudinary/index');
const upload = multer({ storage})
const router=express.Router();
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../schemas.js');
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const {isLoggedIn,validateschema,isAuthor}=require('../middleware');
const campgrounds=require('../controllers/campground');



//writing middleware to validate schema we defined using joi in schemas.js




router.get('/',campgrounds.index );

router.get('/new', isLoggedIn,campgrounds.renderNewForm);

router.post('/', upload.array('images'),validateschema, isLoggedIn,(campgrounds.createNewCampground))


router.get('/:id', isLoggedIn,catchAsync(campgrounds.showCampground));

router.get('/:id/edit', isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm));

router.put('/:id',isAuthor,upload.array('images'),validateschema,catchAsync(campgrounds.updateCampground));

router.delete('/:id',isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground));

module.exports=router;