var express = require('express')
var async = require('async')
var dayRouter = express.Router()
var attractionRouter = express.Router()
var models = require('../models')
var Day = models.Day

// GET /days
dayRouter.get('/', function (req, res, next) {
    Day.find(function(err,results){
    	if(err)
    		next(err)
    	console.log(results)
    	res.json(results)
    })
});
// POST /days
dayRouter.post('/', function (req, res, next) {
    // creates a new day and serves it as json
    Day.find().exec(function(err,days){
	    Day.create({number: days.length + 1, hotel: null, restaurants: [], thingsToDo: [] },function(err,day){
	    	console.log("DAY CREATED: ",day)
	    	res.json(day)
	    })
    })
    
});

dayRouter.use('/:id', function(req, res, next) {
	console.log("MIDDLEWARE",req.params.id)
	req.id = req.params.id
	next()
})

// GET /days/:id
dayRouter.get('/:id', function (req, res, next) {
    // serves a particular day as json
    Day.findOne({'number': req.params.id},function(err,day){
    	res.json(day)
    })

});
// DELETE /days/:id
dayRouter.delete('/:id', function (req, res, next) {
    // deletes a particular day
    Day.remove({'number': req.params.id},function(err,day){
    	res.json(day)
    })
});

dayRouter.use('/:id', attractionRouter);
// POST /days/:id/hotel

attractionRouter.post('/hotel', function (req, res, next) {
    // creates a reference to the hotel
    Day.findOne({number: req.id},function(err,results){
    	if(err) next(err)

    	results.hotel = req.body.hotelId
    	results.save()
    	console.log("UPDATE DAY WITH HOTEL",results)
    	res.json(results)
    })

});
// DELETE /days/:id/hotel
attractionRouter.delete('/hotel', function (req, res, next) {
    // deletes the reference of the hotel
      Day.findOne({number: req.id},function(err,results){
    	if(err) next(err)
    		
    	results.hotel = null
    	results.save()
    	console.log("UPDATE DAY WITH HOTEL",results)
    	res.json(results)
    })
});

// POST /days/:id/restaurants
attractionRouter.post('/restaurants', function (req, res, next) {
    // creates a reference to a restaurant
    Day.findOne({number: req.id},function(err,results){
    	if(err) next(err)

    	results.restaurants.push(req.body.restaurantId)
    	results.save()
    	res.json(results)
    })
});


function spliceItems(attraction,id){
	var i = attraction.indexOf(id)
	return attraction.splice(i,1)
}


// DELETE /days/:dayId/restaurants/:restId
attractionRouter.delete('/restaurant/:id', function (req, res, next) {
    // deletes a reference to a restaurant
     Day.findOne({number: req.id},function(err,results){
    	if(err) next(err)
    	spliceItems(results.restaurants,req.params.id)
    	results.save()
    	res.json(results)
    })
});
// POST /days/:id/thingsToDo
attractionRouter.post('/thingsToDo', function (req, res, next) {
    // creates a reference to a thing to do
    Day.findOne({number: req.id},function(err,results){
    	if(err) next(err)

    	results.thingsToDo.push(req.body.thingId)
    	results.save()
    	res.json(results)
    })
});
// DELETE /days/:dayId/thingsToDo/:thingId
attractionRouter.delete('/thingsToDo/:id', function (req, res, next) {
    // deletes a reference to a thing to do
    Day.findOne({number: req.id},function(err,results){
    	if(err) next(err)
    	spliceItems(results.thingsToDo,req.params.id)
    	results.save()
    	res.json(results)
    })
});



module.exports = dayRouter