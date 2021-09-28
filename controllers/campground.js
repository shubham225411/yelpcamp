const Campground=require('../models/campground');
const {cloudinary}=require('../cloudinary');
module.exports.index=async (req, res) => {
    const campgrounds = await Campground.find({}).populate('author');
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm=(req, res) => {
    res.render('campgrounds/new');
}
module.exports.createNewCampground=async (req, res, next) => {

    //this is schema validation using joi package which we installed
    //it will verify the data we add to our database according to the schema we define here
    //it is client side verification

    
    const campground = new Campground(req.body);
    campground.images=req.files.map(f=>({url:f.path,filename:f.filename}));
    campground.author=req.user;
    await campground.save();
    console.log(campground);
    req.flash('success','added a new campground');
    res.redirect(`/campgrounds/${campground._id}`)

}

module.exports.showCampground=(async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate({
        path:'author'
    })


    //here suppose we opended a campfround copied its url and then deeted it
    //and then we searched that url, of course that is deleted and we wont get our result
    //then this flash will b shown
   
   if(!campground)
   {
       req.flash('error','no such campground found!!')
       return res.redirect('/campgrounds');
   }
    res.render('campgrounds/show', { campground });
})

module.exports.renderEditForm=async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground=async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, req.body);
    const images=req.files.map(f=>({url:f.path,filename:f.filename}));
    campground.images.push(...images);
    await campground.save();
    if(req.body.deleteimages)
    {
        for(let filename of req.body.deleteimages)
        {
            await cloudinary.uploader.destroy(filename);
        }
       
       await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteimages } } } })
    }
    req.flash('success','edited successfully ');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground=async (req, res) => {
    const { id } = req.params;
    
    await Campground.findByIdAndDelete(id);
    req.flash('success',"deleted a campground");
    res.redirect('/campgrounds');
}