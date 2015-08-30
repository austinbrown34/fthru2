


var element = document.createElement('script');
element.src = 'http://maps.googleapis.com/maps/api/js?key=AIzaSyDl5CEPqEKUgpi3FLY6evlhgedJReK62GE&sensor=true&callback=Initialize';
element.type = 'text/javascript';
var scripts = document.getElementsByTagName('script')[0];
scripts.parentNode.insertBefore(element, scripts); 


function Initialize(){
var id= localStorage.getItem('id');
var weblink = 'http://54.186.32.195/getmycoords.php?id='+id;
var getcoords;
var timer;
function getcoords(){
	$.getJSON(
		weblink+"&jsoncallback=?",
		function(data){
			getcoords = data.coords;
			alert(getcoords);
			everythingelse();
			}
	);
	
}

function everythingelse(){
	mapit();
	
}
if (!timer){
	timer = setTimeout(getcoords(),5000);
	console.log("Here son!");
	console.log(timer);
}
else{
	console.log("Timer was already set, son.");
}


}
	