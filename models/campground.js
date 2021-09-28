const mongoose = require("mongoose");

const Review=require('./review')
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  images: [{
    url:String,
    filename:String
  }],
  price: Number,
  description: String,
  location: String,
  author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  reviews:[
      {
          type:Schema.Types.ObjectId,
          ref:'Review'
      }
  ]
});

//here we have access to the thing that has bee just deleted and it will be passed to the fuction
//the campground we just deleted is passed here as doc
CampgroundSchema.post('findOneAndDelete',async function(doc){
  console.log('deleting review of',doc);
  if(doc)
  {
    await Review.deleteMany({_id:{$in:doc.reviews}});
  }

})
module.exports = mongoose.model("Campground", CampgroundSchema);
