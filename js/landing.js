// JavaScript Document
$(function() {
	$("#form1").submit(function(event){
		event.preventDefault(); //prevent redirect/page refresh	
		
		//serialized form data
		var formData = $(this).serialize();
		console.log(formData);
		
		$.ajax({
	    	type: "post",
			data: formData,
			url: "login.php",
			dataType: "json",
	    	success: function(data){
				var loginStatus = data.loginStatus;
				
				var name = data.name;
				var login = data.login;
				var usertype = data.usertype;

				sessionStorage.name = name;
				sessionStorage.login = login;
				sessionStorage.usertype = usertype;

				if (loginStatus == "success")
				{
					window.location = "home.html";
				}
				else
				{
					alert("Wrong Username of Password!");
				}
  			},
  			error: function(data) {
    			alert(data.error);
  			}
	  	});
	});
});