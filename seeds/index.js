const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author:'6148e8253eea732d5c6ef1ed',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            images: [
                {
                  
                  url: 'https://res.cloudinary.com/dudlf14yw/image/upload/v1632300396/YELPCAMP-2/cmnnxr98zp30d3b0xzbt.jpg',
                  filename: 'YELPCAMP-2/cmnnxr98zp30d3b0xzbt'
                },
                {
                  
                  url: 'https://res.cloudinary.com/dudlf14yw/image/upload/v1632300398/YELPCAMP-2/qszo2itaids7o8jjfifg.jpg',
                  filename: 'YELPCAMP-2/qszo2itaids7o8jjfifg'
                },
                {
                  
                  url: 'https://res.cloudinary.com/dudlf14yw/image/upload/v1632300400/YELPCAMP-2/lpc47oxcao3wrddyfqtn.jpg',
                  filename: 'YELPCAMP-2/lpc47oxcao3wrddyfqtn'
                }
              ]
            
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})