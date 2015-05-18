var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/trip_planner')
var db = mongoose.connection;
db.on('error', console.error.bind(console,'mongodb connection error:'));

var placeSchema = new mongoose.Schema({
	address: String,	
	city: String,
	state: String,
	phone: String,
	location: [Number]
})

var hotelSchema = new mongoose.Schema({
	name: String,
	place: [placeSchema],
	num_stars: {type: Number, min: 1, max: 5}
})

var thingToDoSchema = new mongoose.Schema({
	name: String,
	place: [placeSchema],
	age_range: String
})

var restaurantSchema = new mongoose.Schema({
	name: String,
	place: [placeSchema],
	cuisine: String,
	price: Number
})

var Place = mongoose.model('Place',placeSchema)
var Hotel = mongoose.model('Hotel',hotelSchema)
var ThingToDo = mongoose.model('ThingToDo',thingToDoSchema)
var Restaurant = mongoose.model('Restaurant',restaurantSchema)

var daySchema = new mongoose.Schema({
	number: Number,
	hotel: {type: mongoose.Schema.Types.ObjectId, ref: 'Hotel'},
	restaurants: [{type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'}],
	thingsToDo: [{type: mongoose.Schema.Types.ObjectId, ref: 'ThingToDo'}]
})
var Day = mongoose.model('Day',daySchema)

module.exports = {
	Place: Place,
	Hotel: Hotel,
	ThingToDo: ThingToDo,
	Restaurant: Restaurant,
	Day: Day
}