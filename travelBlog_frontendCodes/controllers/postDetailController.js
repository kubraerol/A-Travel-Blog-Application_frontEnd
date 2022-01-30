var travelId;
var userType;
var userId;

(function(){        
    console.log('init postDetail page');
	
	const url = new URL(window.location.href);
	console.log(url);
	
	travelId = url.searchParams.get("travelId");
	userType = url.searchParams.get("userType");
	userId = url.searchParams.get("userId");
	
	console.log(travelId);
	console.log(userType);
    //var userType="traveller";
    //var travelId = "";

    //todo:userType ve travelId sayfaya yönlendirme sırasında gelmeli.
    this.showCorrectButtonsAccordingToUserType(userType);
    this.getPostDetail(travelId);
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

function getPostDetail(travelId){
    //todo: backend ile bağlantı kurulacak, önyüzde ilgili alanlara set edilecek. Şimdilik burada data oluşturdum. Fotolar sabit
    
    var result = 'ok';
    
    URL = "http://localhost:8080/TravelCore/api/travel?travelId="+travelId; 
    var statusCode = 200; //ok
    
    var jsonResponse = getApi(null, URL, statusCode);
    
    if (jsonResponse == null){
        result = 'error';
    } else {
		result = 'ok';
	}
    console.log(result);
	
	
	if (result = 'ok') {
		URL = "http://localhost:8080/TravelCore/api/travel/view?travelId="+travelId; 
    
		var jsonResponse2 = getApi(null, URL, statusCode);
		
		 if (jsonResponse2 == null){
			result2 = 'error';
		 } else {
			 result2 = 'ok';
		 }
		console.log(result2);
	}
    //return result;
	//return [result, membershipId, membershipType];

	
	this.showDataOnFrontEnd(jsonResponse);
    //this.showDataOnFrontEnd(this.createDummyData());
}

function showDataOnFrontEnd(jsonData){
        $("#idCountry").html(jsonData.country);
        $("#idCity").html(jsonData.city);
        $("#idCategory").html(jsonData.category);
        $("#idTitle").html(jsonData.title);
        $("#idArticle").html(jsonData.article);
        $("#idTraveller").html(jsonData.traveller);
    
    //todo: tavsiyeleri de sabit bastım ekrana, düzeltilebilir ama yetişmedi.
}

function createDummyData(){
     var jsonData =   { "title":"İtalya'da.... ",
                        "category":"Kültür",
                        "country": "İtalya",
                        "city":"Roma",
                        "traveller": "Ali Ali", //todo: travelId ile eşleşşme?
                        "article":"Seyahatimize Roma’yla başladık. 2 günlük Roma turu, Roma’ya aşık olmamıza yetti de arttı bile.Roma’da Fiumicino havaalanına gittik. Havaalanı Avrupa’da gördüğüm en kötü havaalanlarından biriydi. İnanılmaz kalabalık, pasaport kontrol kuyruğunun ucu uzadıkça uzayan, sadece 5 kişinin kontrolde çalıştığı(AB vatandaşları için bile kuyruk vardı çünkü 1 kişi çalışıyordu), klimaları yetersiz karmakarışık bir havaalanı. Bu kadar turistik bir yere yakışmıyor. Bavullarımızı aldıktan sonra çıkış kapısının hemen sağında Rome Pass satılan ofisten 25 Euro karşılığında Rome Pass kartları aldık(Satış ofisi Terminal B-C Geliş bölümünde). Web sitesinde daha detaylı bilgi yer alıyor ama kısaca 3 gün boyunca tüm metro ve otobüslere binebileceğiniz ve içerisinde Colloseum(Kolezyum) da dahil 2 müzeye giriş hakkı veren bir kart. Bu kartı almayanlar da metrodan ya da Tabacchi yazan büfelerden günlük kart alabiliyor. Biz zaten Colloseum’u gezmek istediğimizden kolaylık olması için kartları aldık. Rome Pass kart Vatikan’da geçerli değil, bilginiz olsun. Orası ayrı bir devlet. Kartlarımızı aldıktan sonra turun otobüsüyle şehir merkezine geldik ancak kartları alırken şehir merkezine giden trenlerin olduğu tabelaları gördüm. Buradan kendiniz gittiyseniz trenle şehir merkezine gidebilirsiniz.",
                       "hotelAdvices":[
                           {"name": "hotel1", "link":"link1"},
                           {"name": "hotel1", "link":"link1"}
                       ],
                       "visitAdvices":[
                           {"name": "visit1", "link":"link1"},
                           {"name": "visit2", "link":"link1"}
                       ],
                       "restaurantAdvices":[
                           {"name": "rest1", "link":"link1"},
                           {"name": "rest2", "link":"link1"}
                       ]
                       
                       }
     return jsonData;
                    
    }


function getLikeNumber(){
    
}


function getApi(ItemJSON, URL, statusCode){
    
    var jsonResponse = null;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", URL, false);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.onreadystatechange = function() {
        console.log(xmlhttp.status);
        if(xmlhttp.readyState == 4 && xmlhttp.status == statusCode) {
            console.log(xmlhttp.responseText);
            jsonResponse = JSON.parse(xmlhttp.responseText);
        }
    }

    xmlhttp.send(null);
    return jsonResponse;
    
}


function onClickHomePage(){
    window.location.href = "homepage.html?userId="+userId+"&userType="+userType;
}