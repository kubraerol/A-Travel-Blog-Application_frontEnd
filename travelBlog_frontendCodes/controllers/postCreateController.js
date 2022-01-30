var userId;
var travelId;
var userType;

(function(){        
    console.log('init home page');
    //var userType="traveller";
	const url = new URL(window.location.href);
	console.log(url);
	
	userId = url.searchParams.get("userId");
	userType = url.searchParams.get("userType");

	console.log(userId);
	
})(
);



$(document).ready(function(){
    $('#save-button').click(function(){
     
        console.log('save function');
        
        var post=getPost();
		
        if(savePost(post) =='ok'){
            window.location.href = "PostDetail.html?travelId="+travelId+"&userType="+userType+"&userId="+userId;
	    }else{
		    alert('Paylaşım kaydedilemedi');
	    }
        
    });
})


function getPost(){
    var post={
        //şehir, ülke, kategori değerleri backend ile uyumlu olmalı. todo:
        "country": document.getElementById('country').value,
        "city" :document.getElementById('city').value, 
        "category" :document.getElementById('category').value,
        "title":$('input[name=title]').val(),
        "article": $('textarea[name=text]').val(),
		/*
        "hotelAdvices":[    //todo: bu alanlar için ön yüz geliştirmesi eksik şimdilik böyle gnderdim.
            {"name": "test1", "link":"link2"},
            {"name": "test1", "link":"link2"}
        ],
        "restaurantAdvices":[
            {"name": "test1", "link":"link2"},
            {"name": "test1", "link":"link2"}
            ],
        "visitPlaceAdvices":[
             {"name": "test1", "link":"link2"},
            {"name": "test1", "link":"link2"}
        ]*/
    }

    
    console.log('Post: ', post);
    
    return post;
}


function savePost(post){
	//todo post u backend servisinde kaydetmek gerekiyor. Başarılı ise 'ok' dönmek gerek.Ben şimdilik ok yazdım.
	
	var filterJSON = JSON.stringify( { 
		"travellerId":userId,
		"title":post.title,
		"article":post.article,
		"country":post.country,
		"city":post.city,
		"category":post.category,
		"hotelAdvices": post.hotelAdvices,
		"restaurantAdvices": post.restaurantAdvices,
		"visitPlaceAdvices": post.visitPlaceAdvices
	})

	URL = "http://localhost:8080/TravelCore/api/travel"; 
    var statusCode = 201; //created
    
    var jsonResponse = postApi(filterJSON, URL, statusCode);

	if (jsonResponse == null){
		console.log('error');
        return 'error';
    } else {
		console.log('ok');
		travelId = jsonResponse.travelId;
		return 'ok';
	}	
}


function postApi(ItemJSON, URL, statusCode){
    
    var jsonResponse = null;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", URL, false);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.onreadystatechange = function() {
        console.log(xmlhttp.status);
        if(xmlhttp.readyState == 4 && xmlhttp.status == statusCode) {
            console.log(xmlhttp.responseText);
            jsonResponse = JSON.parse(xmlhttp.responseText);
        }
    }
	console.log(ItemJSON);
    xmlhttp.send(ItemJSON);
    return jsonResponse;
    
}

function onClickHomePage(){
    window.location.href = "homepage.html?userId="+userId+"&userType="+userType;
}