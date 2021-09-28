const User = require("../models/users");

module.exports.renderRegisterForm=(req, res) => {
    res.render("users/register");
}

module.exports.registerUser=async (req, res,next) => {
    try{
        const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser,(err)=>{
        if(err)return next(err);
        req.flash('success','registered');
    res.redirect('/campgrounds')
    })
    
    }catch(e){
        req.flash('error',e.message)
        res.redirect('/register');
    }
    
}

module.exports.renderLoginForm=(req,res)=>{
    res.render('users/login');
}
module.exports.loginUser=(req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logOut=(req,res)=>{
    req.logOut();
    req.flash('success','logged out')
    res.redirect('/campgrounds');
}