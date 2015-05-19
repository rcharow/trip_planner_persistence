function initItinerary(){
	$.ajax({
		type: "get",
		url: "/days",
		success: function(responseData){
			initDayButtons(responseData)
			populateItineraryPanel(responseData[0])
		}
	})
}

function initDayButtons(days)
{
	days.forEach(function(day,i){
		var num = day.number
		$('<button data-id="'+ num +'" class="btn btn-default btn-circle days">'+ num +'</button>').insertBefore(".add")

	})
	$('#days').children().first().addClass('btn-active')
}

function addDay(){
	$.ajax({
		type: "post",
		url: "/days",
		success: function(responseData){
			$('<button data-id="'+ responseData.days +'" class="btn btn-default btn-circle days">'+ responseData.days +'</button>').insertBefore(".add")

			//changeDay.call($('#days').children()[responseData.days-1]);
			var numChildren = $('#days').children().length
			changeDay.call($('#days').children()[numChildren-2])
		}
	})
}

function deleteDay(){
	var activeDay = $('#days>.btn-active')
	console.log("ACTIVE DAY",activeDay.data('id'))
	$.ajax({
		type: "delete",
		url: "/days/"+activeDay.text(),
		success: function(responseData){

			//remove button 
			activeDay.remove();

			//change to active day
			var numChildren = $('#days').children().length
			changeDay.call($('#days').children()[numChildren-2])

		}
	})
}

function changeDay(newDay){
	var prevDay = $('#days>.btn-active')
	$(this).addClass('btn-active')
	$('#day-title').text("Day "+ $(this).text())

	if(prevDay.length)
		prevDay.removeClass('btn-active')

	clearItineraryPanel()
		
	getDay($(this).text())

	
}

function clearItineraryPanel(){
	$('#hotelList').empty()
	$('#restaurantList').empty()
	$('#thingsList').empty()
}

function getDay(dayNum){
	$.ajax({
		type: 'get',
		url: '/days/'+dayNum,
		success: function(responseData){
			console.dir("DAY",responseData)
			populateItineraryPanel(responseData)
		}
	})
}

function populateItineraryPanel(day){
	debugger
	//hotels 
	if(day.hotel){
		$('<div class="itinerary-item">' +
			'<span data-attId="'+ day.hotel._id +'" data-class="title">'+ day.hotel.name + '</span>' +
			'<button class="btn btn-xs btn-danger remove btn-delete-circle pull-right">x</button></div>')
		.appendTo('#hotelList')
	}

	//restaurants
	console.dir(day)
	if(day.restaurants.length){
		day.restaurants.forEach(function(r){
			$('<div class="itinerary-item">' +
			'<span data-attId="'+ r._id +'" data-class="title">'+ r.name + '</span>' +
			'<button class="btn btn-xs btn-danger remove btn-delete-circle pull-right">x</button></div>')
		.appendTo('#restaurantList')
		})
	}

	//things
	if(day.thingsToDo.length){
		day.thingsToDo.forEach(function(t){
			$('<div class="itinerary-item">' +
			'<span data-attId="'+ t._id +'" data-class="title">'+ t.name + '</span>' +
			'<button class="btn btn-xs btn-danger remove btn-delete-circle pull-right">x</button></div>')
		.appendTo('#thingsList')
		})
	}
}

function addAttraction(){	
	if($('.days').length>0){
		var attractionElements = getAttractionElements($(this)[0].id)

		var attractionId = $(attractionElements.cbo).val()

		//remove current hotel
		if($(this)[0].id==="btnAddHotel")
			$(attractionElements.list).empty()
		
		//add selected attraction
		$('<div class="itinerary-item">' +
		'<span data-attId="'+attractionId+'" data-class="title">'+ $(attractionElements.cbo+' option:selected').text() + '</span>' +
		'<button class="btn btn-xs btn-danger remove btn-delete-circle pull-right">x</button></div>')
		.appendTo(attractionElements.list)

		debugger
		updateItinerary(parseInt($('#days>.btn-active').text()),attractionElements,attractionId)
		//var marker = addMapMarker('hotel',$('#cboHotel').val())
	}

}

function getAttractionElements(btn){
	attractionElements = {}
	switch(btn){
		case 'btnAddHotel':
		attractionElements.attractionType = 'hotel'
			attractionElements.cbo = '#cboHotel'
			attractionElements.list = '#hotelList'
		break;
		case 'hotelList':
			attractionElements.attractionType = 'hotel'
			attractionElements.cbo = '#cboHotel'
			attractionElements.list = '#hotelList'
		break;
		case 'btnAddRestaurant':
		attractionElements.attractionType = 'restaurants'
			attractionElements.cbo = '#cboRestaurant'
			attractionElements.list = '#restaurantList'
		break;
		case 'restaurantList':
			attractionElements.attractionType = 'restaurant'
			attractionElements.cbo = '#cboRestaurant'
			attractionElements.list = '#restaurantList'
		break;
		case 'btnAddThing':
		attractionElements.attractionType = 'thingsToDo'
			attractionElements.cbo = '#cboThing'
			attractionElements.list = '#thingsList'
		break;
		case 'thingsList':
			attractionElements.attractionType = 'thingToDo'
			attractionElements.cbo = '#cboThing'
			attractionElements.list = '#thingsList'
		break;
	}
	return attractionElements
}

function updateItinerary(dayNum, attractionElements,attractionId){
	attractionList = $(attractionElements.list)

	$.ajax({
		type: "post",
		url: "/days/"+dayNum+'/'+attractionElements.attractionType,
		data: {attractionId:attractionId},
		success: function(responseData){
			console.log("POST RESPONSE",responseData)
		}
	})
}

function removeItineraryItemFromDb(dayNum, attractionElements,attractionId){
	attractionList = $(attractionElements.list)

	$.ajax({
		type: "delete",
		url: "/days/"+dayNum+'/'+attractionElements.attractionType+'/'+attractionId,
		success: function(responseData){
			console.log("DELETE RESPONSE",responseData)
		}
	})
}

function removeItineraryItem(){
	var day = parseInt($('#days>.btn-active').text())
	// markerTitle = $(this).parent().find('.title').text()
	//removeMarker(markerTitle,day)

	var attractionElements = getAttractionElements($(this).parent().parent()[0].id)

	var attractionId = $(this).prev()[0].dataset.attid

	$(this).parent().remove()
	removeItineraryItemFromDb(day,attractionElements,attractionId)
}
/* 
	1. when new day is pressed, it creates new day and serves it as json
	2. when itinerary item is added, it is added to the new day json object
	3. json object is saved to database
*/ 



$('#btnAddDay').on('click',addDay);
$('#btnRemoveDay').on('click',deleteDay)
$('#btnAddHotel').on('click',addAttraction)
$('#btnAddRestaurant').on('click',addAttraction)
$('#btnAddThing').on('click',addAttraction)

$('#itinerary').delegate('.remove', 'click', removeItineraryItem)
$('#days').delegate('.days', 'click', changeDay);

$(document).ready(function() {
    initItinerary()
});