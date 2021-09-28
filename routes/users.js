const express = require("express");
const router = express.Router();
const User = require("../models/users");
const catchAsync = require("../utils/catchAsync");
//const ExpressError = require('../utils/ExpressError');
const passport=require('passport');
const users=require('../controllers/users');
router.get("/register",users.renderRegisterForm );

router.post(
    "/register",
    catchAsync(users.registerUser)
);

router.get('/login',users.renderLoginForm)

// router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
//     req.flash('success','welcome back');
//     res.redirect('/campgrounds');
// })

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),users.loginUser )
router.get('/logout',users.logOut)


module.exports = router;
