function addDay(){
	$.ajax({
		type: "post",
		url: "/days",
		success: function(responseData){
			$('<button class="btn btn-default btn-circle days">'+ responseData.days +'</button>').insertBefore(".add")
			changeDay.call($('#days').children()[responseData.days-1]);
		}
	})
}

function changeDay(){
	var prevDay = $('#days>.btn-active')
	$(this).addClass('btn-active')
	$('#day-title').text("Day "+ $(this).text())

	if(prevDay.length){
		prevDay.removeClass('btn-active')
		
	//get data for current day


	//populate panel with current day

	}
}


/* 
	1. when new day is pressed, it creates new day and serves it as json
	2. when itinerary item is added, it is added to the new day json object
	3. json object is saved to database
*/ 



$('#btnAddDay').on('click',addDay);
$('#days').delegate('.days', 'click', changeDay);