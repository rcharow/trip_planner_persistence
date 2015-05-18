var express = require('express')
var async = require('async')
var router = express.Router()
var models = require('../models')

//utils
// function mapToField(data,field){
// 	 return data.map(function(datum){
// 	 		return datum[field]
// 	 })
// }

router.get('/',function(req,res,next){

	async.parallel({
		hotels: function(cb){
			models.Hotel.find(cb)
		},
		// hotels: function(cb){
		// 	models.Hotel.find(cb);
		// },
		restaurants: function(cb){
			models.Restaurant.find(cb)
		},
		things_to_do: function(cb){
			models.ThingToDo.find(cb)
		}
	},function(err,results){
		if(err) next(err)
		res.render('index',{
			hotels: results.hotels,
			restaurants: results.restaurants, 
			things_to_do: results.things_to_do
		})
		//res.json(results)
	})

	
})

//promises alternative
// router.get('/slowPromises',function(req,res,next){
// 	//exec returns a promise
// 	models.Hotel.find().exec()
// 	.find()
// 	.exec()
// 	.then(function(hotels){
// 		res.locals.hotels = hotels
// 		return models.Restaurant.find().exec()
// 	})
// 	.then(function(restaurants){
// 		res.locals.restaurants = restaurants
// 		return models.ThingToDo.find().exec()
// 	})
// 	.then(function(thingsToDo){
// 		res.locals.thingsToDo = thingsToDo
// 		res.json()
// 	})
// })

//async promises alternative
// var Promise = require('bluebird')
// router.get('/fastPromises',function(req,res,next){
// 	Promise.join(models.Hotel.find().exec(),
// 		models.Restaurant.find().exec(),
// 		models.ThingToDo.find().exec()
// 	)
// 	.spread(function(hotels, restaurants, thingsToDo){
// 		res.json({
// 			hotels: hotels,
// 			restaurants: restaurants,
// 			thingsToDo: thingsToDo
// 		})
// 	})
// })


module.exports = router