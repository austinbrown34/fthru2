/*
	sm.js
	
	Util file for Social Motives
*/


function errorMsg(msg, timeout)
{
	// Display Please Wait...
	$.blockUI({ message: msg, css: { 
				border: 'none', 
				padding: '15px', 
				backgroundColor: '#880000', 
				'-webkit-border-radius': '10px', 
				'-moz-border-radius': '10px', 
				color: '#fff' 
			} }); 

	if(timeout>0)
		setTimeout($.unblockUI, timeout); 
};

function okMsg(msg, timeout, callback)
{
	// Display Please Wait...
	$.blockUI({ message: msg, css: { 
				border: 'none', 
				padding: '15px', 
				backgroundColor: '#000', 
				'-webkit-border-radius': '10px', 
				'-moz-border-radius': '10px', 
				color: '#fff' 
			} }); 

	if(timeout>0)
	{
		setTimeout(function() 
		{ 
            $.unblockUI(
			{ 
                onUnblock: callback
			});
		},			
        timeout);
	}
};

function changePage3(page)
{
	if(page == "mapit3"){
	try{
	fb.slider.removeCurrentPage();
	}
	catch(err){
	console.log(err);
	}
	gotoMap();
	}
	else if(page == "home"){
	fb.slider.slidePageFrom(new fb.views.Post({template: fb.templateLoader.get('post')}).$el, 'left');
	}
	else if(page == "friends_list"){

	fb.slider.slidePageFrom(new fb.views.Post({template: fb.templateLoader.get('postui')}).$el, 'left');
	
	
	}
	else if(page == "flickthru"){

	try{
	fb.slider.removeCurrentPage();
	}
	catch(err){
	console.log(err);
	}
	gotoMap();
	
	}
	else if(page == "profile-private"){
	fb.slider.slidePageFrom(new fb.views.Post({template: fb.templateLoader.get('revoke')}).$el, 'left');
	}
	else{
	page = page + ".html";
	  $.ajax({
                     url:page,
                    
                     cache:false
                     }).done(function(html){
                      $('#container').empty();
                      $('#container').append(html);
                      $("#home").css("top","0px");
                     					 $('#container').fadeIn(1000);
                                       
                                       
                                     });
                                     
//	window.open(page,'_self');

	//document.location.href = page;
	}
};

function changePage33(page)
{
if(page == "mapit3"){
try{
	fb.slider.removeCurrentPage();
	}
	catch(err){
	console.log(err);
	}
	gotoMap();
	}
		else if(page == "home"){
	fb.slider.slidePageFrom(new fb.views.Post({template: fb.templateLoader.get('post')}).$el, 'left');
	}
	else if(page == "friends_list"){

	fb.slider.slidePageFrom(new fb.views.Post({template: fb.templateLoader.get('postui')}).$el, 'left');
	
	
	}
	else if(page == "flickthru"){
try{
	fb.slider.removeCurrentPage();
	}
	catch(err){
	console.log(err);
	}
	gotoMap();
	
	
	}
	else if(page == "profile-private"){
	fb.slider.slidePageFrom(new fb.views.Post({template: fb.templateLoader.get('revoke')}).$el, 'left');
	}
	else{
	page = page + ".html";
	
window.open(page,'_self');

	//document.location.href = page;
	}
};
function changePage(page)
{
if(page == "mapit3"){
try{
	fb.slider.removeCurrentPage();
	}
	catch(err){
	console.log(err);
	}
	
	gotoMap();
	}
		else if(page == "home"){
	fb.slider.slidePageFrom(new fb.views.Post({template: fb.templateLoader.get('post')}).$el, 'left');
	}
	else if(page == "friends_list"){

	fb.slider.slidePageFrom(new fb.views.Post({template: fb.templateLoader.get('postui')}).$el, 'left');
	
	
	}
	else if(page == "flickthru"){

try{
	fb.slider.removeCurrentPage();
	}
	catch(err){
	console.log(err);
	}
	gotoMap();
	
	}
	else if(page == "profile-private"){
	fb.slider.slidePageFrom(new fb.views.Post({template: fb.templateLoader.get('revoke')}).$el, 'left');
	}
	else{
	page = page + ".html";
	  $.ajax({
                     url:page,
                    
                     cache:false
                     }).done(function(html){
                      $('#container').empty();
                     $("#container").append(html);
                      $("#home").css("top","0px");
//                      $("#home").css("top","0px");
                     					 $('#container').fadeIn(1000);
                                        
                                       
                                     });
                                     
//	window.open(page,'_self');

	//document.location.href = page;
	}
};

function changePage2(page)
{
if(page == "mapit3"){
try{
	fb.slider.removeCurrentPage();
	}
	catch(err){
	console.log(err);
	}
	gotoMap();
	}
		else if(page == "home"){
	fb.slider.slidePageFrom(new fb.views.Post({template: fb.templateLoader.get('post')}).$el, 'left');
	}
	else if(page == "friends_list"){

	fb.slider.slidePageFrom(new fb.views.Post({template: fb.templateLoader.get('postui')}).$el, 'left');
	
	
	}
	else if(page == "flickthru"){
try{
	fb.slider.removeCurrentPage();
	}
	catch(err){
	console.log(err);
	}
	gotoMap();
	
	}
	else if(page == "profile-private"){
	fb.slider.slidePageFrom(new fb.views.Post({template: fb.templateLoader.get('revoke')}).$el, 'left');
	}
	else{
	page = page;
	  $.ajax({
                     url:page,
                    
                     cache:false
                     }).done(function(html){
                      $('#container').empty();
                     $('#container').append(html);
                     $("#home").css("top","0px");
                     					 $('#container').fadeIn(1000);
                                        
                                       
                                     });
                                     
//	window.open(page,'_self');

	//document.location.href = page;
	}
};


function trashmsg(mid){

  var id= localStorage.getItem('id');
            //  webadd ="http://54.186.32.195/actions.php?task=logoutstatus&id="+id;
		
            // Call register action, which checks for unique email and SM ID (on success: load home screen, fail: display msg)
            var request = $.ajax({
                url: "http://54.186.32.195/actions.php?task=trashmsg&mid="+mid,
                type: "post",
                data: 'id=' + id
    });

    // callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR)
    {
        // response == 0 - Successful
       // alert(response);
        if(response == "0")
        {
         //   localStorage.clear();
          //  window.open('profile-public-browse.html','_self');
//            $('div.button.block').html('<a href="#">Unblock</a>');
// unfriend(pid);
//delfriend(pid)

        //  changePage('profile-public-browse');
            return true;
        }
        // response == 1 - Unknown error
        if(response == "1")
        {
            errorMsg("Problem with updating. Try again later.", 3000);
            return false;
        }
    });

    // callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown)
    {
        // log the error to the console
        console.error(
            "The following error occured: "+
                textStatus, errorThrown
        );

        errorMsg("Problem with updating. Try again later.", 3000);
        return false;

    });



};

function deleteaccount(){
  function onConfirm(button) {
        if(button ==1){
      
            var id= localStorage.getItem('id');
            //  webadd ="http://54.186.32.195/actions.php?task=logoutstatus&id="+id;
		
            // Call register action, which checks for unique email and SM ID (on success: load home screen, fail: display msg)
            var request = $.ajax({
                url: "http://54.186.32.195/actions.php?task=delete",
                type: "post",
                data: 'id=' + id
    });

    // callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR)
    {
        // response == 0 - Successful
//        alert(response);
        if(response == "0")
        {
         //   localStorage.clear();
          //  window.open('profile-public-browse.html','_self');
//            $('div.button.block').html('<a href="#">Unblock</a>');
// unfriend(pid);
//delfriend(pid)
alert("Account Deleted!");
            var id= localStorage.getItem('id');
            //  webadd ="http://54.186.32.195/actions.php?task=logoutstatus&id="+id;

            // Call register action, which checks for unique email and SM ID (on success: load home screen, fail: display msg)
            var request = $.ajax({
                url: "http://54.186.32.195/actions.php?task=logoutstatus",
                type: "post",
                data: 'id=' + id
    });

    // callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR)
    {
        // response == 0 - Successful
       // alert(response);
        if(response == "0")
        {
            localStorage.clear();
            window.open('index.html','_self');
            return true;
        }
        // response == 1 - Unknown error
        if(response == "1")
        {
            errorMsg("Problem with updating. Try again later.", 3000);
            return false;
        }
    });

    // callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown)
    {
        // log the error to the console
        console.error(
            "The following error occured: "+
                textStatus, errorThrown
        );

        errorMsg("Problem with updating. Try again later.", 3000);
        return false;

    });
      localStorage.clear();
     window.open('index.html','_self');
//           changePage('index');
            return true;
        }
        // response == 1 - Unknown error
        if(response == "1")
        {
            errorMsg("Problem with updating. Try again later.", 3000);
            return false;
        }
    });

    // callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown)
    {
        // log the error to the console
        console.error(
            "The following error occured: "+
                textStatus, errorThrown
        );

        errorMsg("Problem with updating. Try again later.", 3000);
        return false;

    });


}
}
 navigator.notification.confirm(
            'Are you sure you want to delete your account?',  // message
            onConfirm,              // callback to invoke with index of button pressed
            'Delete Account',            // title
            'Confirm,Cancel'          // buttonLabels
        );


}

function block(pid){
    function onConfirm(button) {
        if(button == 1){
            var id= localStorage.getItem('id');
            //  webadd ="http://54.186.32.195/actions.php?task=logoutstatus&id="+id;
		
            // Call register action, which checks for unique email and SM ID (on success: load home screen, fail: display msg)
            var request = $.ajax({
                url: "http://54.186.32.195/actions.php?task=block&pid="+pid,
                type: "post",
                data: 'id=' + id
    });

    // callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR)
    {
        // response == 0 - Successful
       // alert(response);
        if(response == "0")
        {
         //   localStorage.clear();
          //  window.open('profile-public-browse.html','_self');
//            $('div.button.block').html('<a href="#">Unblock</a>');
// unfriend(pid);
delfriend(pid)

          changePage('profile-public-browse');
            return true;
        }
        // response == 1 - Unknown error
        if(response == "1")
        {
            errorMsg("Problem with updating. Try again later.", 3000);
            return false;
        }
    });

    // callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown)
    {
        // log the error to the console
        console.error(
            "The following error occured: "+
                textStatus, errorThrown
        );

        errorMsg("Problem with updating. Try again later.", 3000);
        return false;

    });


}
}
 navigator.notification.confirm(
            'Are you sure you want to block this user?',  // message
            onConfirm,              // callback to invoke with index of button pressed
            'Block User',            // title
            'Confirm,Cancel'          // buttonLabels
        );

}

function delfriend(pid){


	var request = $.ajax({
			url: "http://54.186.32.195/actions.php?task=del_friend&id="+id,
			type: "post",
			data: '&val=' + pid
		});

	// callback handler that will be called on success
	request.done(function (response, textStatus, jqXHR)
	{
		// response == 0 - Successful
		if(response == "0")
		{
						 $('div.button.friend').html('<a href="javascript:addFriend3(' + val + ');">Add Friend</a>');

			// refresh page
			//changePage('profile-public-browse');
			return true;
		}
		// response == 1 - Unknown error
		if(response == "1" || response == "-1")
		{
			errorMsg("Problem with updating. Try again later.", 3000);
			return false;
		}
	});

	// callback handler that will be called on failure
	request.fail(function (jqXHR, textStatus, errorThrown)
	{
		// log the error to the console
		console.error(
			"The following error occured: "+
			textStatus, errorThrown
		);
					
		errorMsg("Problem with updating. Try again later.", 3000);
		return false;

	});	
	

}

function unblock(pid){
  function onConfirm(button) {
        if(button == 1){
            var id= localStorage.getItem('id');
            //  webadd ="http://54.186.32.195/actions.php?task=logoutstatus&id="+id;
		
            // Call register action, which checks for unique email and SM ID (on success: load home screen, fail: display msg)
            var request = $.ajax({
                url: "http://54.186.32.195/actions.php?task=unblock&pid="+pid,
                type: "post",
                data: 'id=' + id
    });

    // callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR)
    {
        // response == 0 - Successful
       // alert(response);
        if(response == "0")
        {
         //   localStorage.clear();
          //  window.open('profile-public-browse.html','_self');
           $('div.button.block').html('<a href="#">Block</a>');
          changePage('profile-public-browse');
            return true;
        }
        // response == 1 - Unknown error
        if(response == "1")
        {
            errorMsg("Problem with updating. Try again later.", 3000);
            return false;
        }
    });

    // callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown)
    {
        // log the error to the console
        console.error(
            "The following error occured: "+
                textStatus, errorThrown
        );

        errorMsg("Problem with updating. Try again later.", 3000);
        return false;

    });


}
}
 navigator.notification.confirm(
            'Are you sure you want to unblock this user?',  // message
            onConfirm,              // callback to invoke with index of button pressed
            'Unblock User',            // title
            'Confirm,Cancel'          // buttonLabels
        );

}

function logOff(){
  function onConfirm(button) {
        if(button == 1){
            var id= localStorage.getItem('id');
            //  webadd ="http://54.186.32.195/actions.php?task=logoutstatus&id="+id;

            // Call register action, which checks for unique email and SM ID (on success: load home screen, fail: display msg)
            var request = $.ajax({
                url: "http://54.186.32.195/actions.php?task=logoutstatus",
                type: "post",
                data: 'id=' + id
    });

    // callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR)
    {
        // response == 0 - Successful
       // alert(response);
        if(response == "0")
        {
            localStorage.clear();
            window.open('index.html','_self');
            return true;
        }
        // response == 1 - Unknown error
        if(response == "1")
        {
            errorMsg("Problem with updating. Try again later.", 3000);
            return false;
        }
    });

    // callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown)
    {
        // log the error to the console
        console.error(
            "The following error occured: "+
                textStatus, errorThrown
        );

        errorMsg("Problem with updating. Try again later.", 3000);
        return false;

    });


}
}
 navigator.notification.confirm(
            'Are you sure you want to Log Off?',  // message
            onConfirm,              // callback to invoke with index of button pressed
            'Log Off',            // title
            'Confirm,Cancel'          // buttonLabels
        );

};

function gotoMap(){
var themap = localStorage.getItem('map');
if(typeof themap !== undefined && themap !== null){
//fb.mapslider.slidePageFrom(new fb.views.Post({template: fb.templateLoader.get('error')}).$el, 'left');
  //   $('#mapcontainer').empty();
//                      $("#mapcontainer").append(fb.templateLoader.get('error')}).$el);
// }
// $('#mapcontainer').toggle();
// $('#mapcontainer').toggle();
localStorage.setItem("lp", localStorage.getItem('tp'));
			var lp = localStorage.getItem('lp');
			localStorage.setItem("tp","mapit3");
			var tp = localStorage.getItem('tp');
				$('#mapcontainer').toggle();
				google.maps.event.trigger(map, 'resize');

}
else{
//fb.mapslider.slidePage(fb.templateLoader.get('error').$el);
fb.mapslider.slidePageFrom(new fb.views.Post({template: fb.templateLoader.get('error')}).$el, 'left');
//fb.router.navigate("error", {trigger: true});
}

}
function goBack()
{
	// For now
	history.go(-1);return false;
	//window.history.back();
};