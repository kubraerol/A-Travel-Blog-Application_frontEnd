var userId;
var userType;

(function(){        
    console.log('init home page');
    //var userType="traveller";
	const url = new URL(window.location.href);
	console.log(url);
	
	userId = url.searchParams.get("userId");
	userType = url.searchParams.get("userType");
	
	console.log(userId);
	console.log(userType);
	
    this.showCorrectButtonsAccordingToUserType(userType);
    this.getPostsbyFilters('','','','',''); //todo: filtresiz olarak backendden tüm postların gelmesini bekliyorum.
})(
);

function showCorrectButtonsAccordingToUserType(userType){
    console.log('userType: ', userType);
    switch(userType) {
        case 'visiter':
            $(".signInButton").hide();
            $(".newPostButton").hide();
            break;
        case 'traveller':
            $(".signInButton").hide();
            break;
        case 'notAMember':
            $(".messagesButton").hide();
            $(".userSettingsButton").hide();
            $(".newPostButton").hide();
            break;
            
        default: 
            console.log('member type can not be found!');
    }
}

function onClickNewPost(){
	console.log(userId);
    window.location.href = "PostCreate.html?userId="+userId+"&userType="+userType; 
}

function onClickSearch(){
    console.log('onClickSearch ' );
    var country = document.getElementById('countries').value;
    var city = document.getElementById('cities').value;
    var traveller = document.getElementById('travellers').value;
    var category = document.getElementById('categories').value;
    
    console.log('Ülke ',country);
    console.log('Şehir ',city);
    console.log('Gezgin ',traveller);
    console.log('Kategori ',category);
    
    this.getPostsbyFilters(country,city,traveller,category, ""); //sıralama tipi boş olmalı.
}

function getPostsbyFilters(country,city,traveller,category,listType){
    //todo: bu jsondata backendden gelecek servis ile oluşturulmalı.
	var filterJSON = JSON.stringify( {
        country: country,
        city: city,
		traveller: traveller,
		category: category,
        listType: listType
    })
	
	console.log(filterJSON);
	
	URL = "http://localhost:8080/TravelCore/api/travel/filter"; 
    var statusCode = 200; //ok
    
    var jsonResponse = getApi(filterJSON, URL, statusCode);
	
	console.log(jsonResponse);
	
	for(var i=0; i<jsonResponse.posts.length; i++){
		console.log(i);
		var counter = jsonResponse.posts[i];
	}
	
	var jsonData =  {"posts":[]};
	
	for(var i=0; i<jsonResponse.posts.length; i++){
		var post = jsonResponse.posts[i];
		
		jsonData.posts.push({
			"TravelId": post.travelId,
			"Title": post.title,
			"Category": post.category,
			"Traveller": post.traveller,
			"Date": post.createDate,
			"LikeNumber": post.likeNumber,
			"viewNumber": post.readNumber,
			"country": post.country,
			"city": post.city,
			"summaryOfPost": post.article.substring(0,100)  //TODO: ilk 100 karakteri alıyor değiştirilebilir. 
		});
	}
	/*
    var jsonData =  {"posts":[
                       {"Title":" A Loving Heart is the Truest Wisdom",
                        "Category":"Doğa",
                        "Traveller":"Ad1 Soyad1",
                        "Date": "Ocak 28, 2019",
                        "LikeNumber": "5",
                        "commentNumber":"3",
                        "country": "Türkiye",
                        "city":"Muğla",
                        "summaryOfPost": "A small river named Duden flows by their place and supplies it with the necessary regelialia."
                       },
                       {"Title":"Title2",
                        "Category":"Deniz",
                        "Traveller":"Ad2 Soyad2",
                        "Date": "Temmuz 28, 2019",
                        "LikeNumber": "5",
                        "commentNumber":"3",
                         "country": "Türkiye",
                        "city":"Muğla",
                        "summaryOfPost": "Yazının başlangıcı"
                       },
                    
    ]};
	*/
    this.showDataOnFrontEnd(jsonData);
}

function showDataOnFrontEnd(jsonData){
    console.log(jsonData);
    w3.displayObject("idPostsTable", jsonData);
    //todo: belki refresh eklenmesi gerekir, test ile bakarız.
}

//todo: hangi post olduğuna dair parametre almalı. O parametre ile sayfaya yönlendirilmeli.(Önyüz)
function navigateToPostDetailPage(TravelId){
	console.log(TravelId);
    window.location.href = "postDetail.html?userType="+userType+"&travelId="+TravelId+"&userId="+userId;
}

function onClickHomePage(){
    window.location.href = "homepage.html?userId="+userId+"&userType="+userType;
}
//user tipi ile navigasyon sağlanmalı.
/*
$(".blog-entry-title").click(function(){
    navigateToPostDetailPage();
});*/

function onClickListByCreatedDate(){
   this.listPosts('date'); //date alanı backend ile uyuşmuyor olabilir, servis çağrılırken uyum sağlanmalı.
}
function onClickListByLikeNumber(){
   this.listPosts('likeNumber'); //likeNumber alanı backend ile uyuşmuyor olabilir, servis çağrılırken uyum sağlanmalı.
}
function onClickListByReadMumber(){
   this.listPosts('readNumber'); //readNumber alanı backend ile uyuşmuyor olabilir, servis çağrılırken uyum sağlanmalı.
}

function listPosts(operation){
    
    //todo: postları sıralamak lazım, backend servisine filtre olarak gönderebiliriz backend deki yapı uygunsa.
    var country = document.getElementById('countries').value;
    var city = document.getElementById('cities').value;
    var traveller = document.getElementById('travellers').value;
    var category = document.getElementById('categories').value;
    
    console.log('Ülke ',country);
    console.log('Şehir ',city);
    console.log('Gezgin ',traveller);
    console.log('Kategori ',category);
    
    this.getPostsbyFilters(country,city,traveller,category, operation); //todo: operation için gönderilecek değer backend ile uyuşmalı. 
}

function getApi(ItemJSON, URL, statusCode){
    
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