var itinerary = [];

function addHotel(){	
	if($('.days').length>0){
		//remove current hotel
		$('#hotelList').empty()
		//add selected hotel
		$('<div class="itinerary-item">' +
		'<span class="title">'+ $('#cboHotel').val() + '</span>' +
		'<button class="btn btn-xs btn-danger remove btn-delete-circle pull-right">x</button></div>')
		.appendTo('#hotelList')

		updateItinerary(parseInt($('#days>.btn-active').text()))
		var marker = addMapMarker('hotel',$('#cboHotel').val())
		itinerary[parseInt($('#days>.btn-active').text())].markers.push(marker)
	}

}

function addThing(){
	if($('.days').length>0){
			$('<div class="itinerary-item">' +
		'<span class="title">'+ $('#cboThing').val() + '</span>' +
		'<button class="btn btn-xs btn-danger remove btn-delete-circle pull-right">x</button></div>')
		.appendTo('#thingsList')

		updateItinerary(parseInt($('#days>.btn-active').text()))
		var marker = addMapMarker('thing',$('#cboThing').val())
		itinerary[parseInt($('#days>.btn-active').text())].markers.push(marker)
	}
}

function addRestaurant(){
	if($('.days').length>0){
		if($('#restaurantList').children().length < 4){
			$('<div class="itinerary-item">' +
			'<span class="title">'+ $('#cboRestaurant').val() + '</span>' +
			'<button class="btn btn-xs btn-danger remove btn-delete-circle pull-right">x</button></div>')
			.appendTo('#restaurantList')

			updateItinerary(parseInt($('#days>.btn-active').text()))
			var marker = addMapMarker('restaurant',$('#cboRestaurant').val())
			itinerary[parseInt($('#days>.btn-active').text())].markers.push(marker)
		}
	}
}

function addDay(){
	var days = $('#days').children().length
	$('<button class="btn btn-default btn-circle days">'+ days +'</button>').insertBefore(".add")
	var emptyItinerary = itinerary[0].dest.clone(true)
	itinerary.push({dest: emptyItinerary, markers: []})
	changeDay.call($('#days').children()[days-1])
}

function updateItinerary(day){
	var clone = $(('#itinerary')).clone(true)
	itinerary[day].dest = clone
}

function removeDay(){
	var dayText = $('#day-title').text()
	var day = parseInt(dayText.slice(dayText.indexOf(" ")))
	clearMap(day)

	if(day===day){
		//remove button and change numbers
		var dayNum = parseInt($('.btn-active').text())
		$('.days.btn-active').remove()
		var btns = $('.days')
		btns.each(function(i){
			$(this).text(i+1)
		})

		//remove day from itinerary
		itinerary.splice(day,1);

		//activate a different day
		var numDays = itinerary.length
		if(numDays>1){
			$('#itinerary').replaceWith(itinerary[1].dest)
			$('.days').first().addClass('btn-active')
			$('#day-title').text('Day 1')
			populateMap(1)
		}else{
			$('#itinerary').replaceWith(itinerary[0].dest)
			$('#day-title').text('Add a day:')
			populateMap(0)
		}
	}

}

function removeItineraryItem(){
	var day = parseInt($('#days>.btn-active').text())
	var markerTitle = $(this).parent().find('.title').text()
	removeMarker(markerTitle,day)

	$(this).parent().remove()
	updateItinerary(day)
}

function removeMarker(markerTitle,day){
	var markers = itinerary[day].markers
	var idx;
	markers.forEach(function(m,i){
		if(m.title === markerTitle) idx = i
	})

	markers.splice(idx,1)[0].setMap(null)

}

function clearMap(day){
		var markers = itinerary[day].markers
		markers.forEach(function(m){
			m.setMap(null)
		})
}

function populateMap(day){
	var markers = itinerary[day].markers
		markers.forEach(function(m){
			m.setMap(map)
		})
}

function changeDay(){
	var prevDay = $('#days>.btn-active')
	$(this).addClass('btn-active')
	$('#day-title').text("Day "+ $(this).text())

	if(prevDay.length){
		prevDay.removeClass('btn-active')
		var curDay = itinerary[parseInt($(this).text())].dest
		$('#itinerary').replaceWith(curDay)
	}

	clearMap(parseInt(prevDay.text()))
	populateMap(parseInt($(this).text()))
}

function getPlace(schema,placeName){

	return schema.filter(function(item){
					console.dir(item)
					return item.name===placeName
			})[0].place[0].location
}


function addMapMarker (locationType,name){
	var lat, lon;
	var place;
	switch(locationType){
		case 'hotel':
			place = getPlace(all_hotels,name)
			break;
		case 'thing':
			place = getPlace(all_things_to_do,name)
			break;
		case 'restaurant':
			place = getPlace(all_restaurants,name)
			break;
		default:
			console.log("update map error?")
			break;
	}
	lat = place[0]
	lon = place[1]
	var latLng = new google.maps.LatLng(lat,lon);
	var marker = new google.maps.Marker({
	        position: latLng,
	        title: name
	    });

   marker.setMap(map)

   return marker
}

$(document).ready(function() {
   // itinerary[0].dest=$('#itinerary').clone(true)
    itinerary[0] = {dest: $('#itinerary').clone(true),markers:  []}
});

$('#btnAddHotel').on('click',addHotel)
$('#btnAddThing').on('click',addThing)
$('#btnAddRestaurant').on('click',addRestaurant)
$('#btnAddDay').on('click',addDay)
$('#btnRemoveDay').on('click',removeDay)

$('#itinerary').delegate('.remove', 'click', removeItineraryItem)
$('#days').delegate('.days', 'click', changeDay)