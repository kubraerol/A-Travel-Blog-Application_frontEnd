
//This is the init function
(function(){        
    console.log('init');
    this.showCorrectPopup('login');
})(
);

function onClickLogin(){
    console.log('onClickLogin');
    var email = $('input[name=usermail]').val();
    var password = $('input[name=password]').val();
    
    //üyelik controlLoginInfo fonksiyonunda kontrol ediliyor.
	var result = this.controlLoginInfo(email, password);
    if(result[0] == 'ok'){
       this.navigateToHomePage('login',result[1], result[2]);    
    }else{
        alert('Geçersiz üye girişi!');
		window.location.href = "login.html";
    }
}

//this function open sign up box, default should be visiter sign up
function onClickSignUp(){
    console.log('onClickSignUp ' );
    this.showCorrectPopup('visiterSignup');
}

//this function is to save new member 
function onClickSubmit(membershipType){
    console.log('onClickSubmit ' , membershipType);
    var password = $('input[name=password1]').val();
    var confirmPassword = $('input[name=password2]').val(); 
    
    if(this.controlPasswordIsValid(password,confirmPassword) == 'ok'){
		var result = this.addMember(membershipType);
        if(result[0] == 'ok'){
            this.navigateToHomePage('signup', result[1], membershipType); 
        }else{
            alert('Kullanıcı kaydedilemedi');
			window.location.href = "login.html";
        } 
    }else{
        alert('Parola ve Parola(Tekrar) alanları uyuşmamaktadır!');
		window.location.href = "login.html";
    }
   
}

function onClickContinue(){
    console.log('onContinueclick');
    var password = $('input[name=password1]').val();
    var confirmPassword = $('input[name=password2]').val(); 
    
    if(this.controlPasswordIsValid(password,confirmPassword) == 'ok'){
          this.showCorrectPopup('signupProfil');
    }else{
        alert('Parola ve Parola(Tekrar) alanları uyuşmamaktadır!');
    }
}

$(".visiterSignUpForm").click(function(){
    showCorrectPopup('visiterSignup');
});

$(".travellerSignUpForm").click(function(){
    showCorrectPopup('travellerSignup');
});


function showCorrectPopup(correctPopup){
    console.log(correctPopup);
    switch(correctPopup) {
        case 'login':
            $(".signup-box").hide();
            $(".signupProfil-box").hide();
            break;
        case 'visiterSignup':
            $(".login-box").hide();
            $(".signup-box").show();    
            $(".travellerSignUpForm").css("background", "#A9A9A9");
            $(".visiterSignUpForm").css("background", "#fff");
            $(".continue").hide();
            $(".submit").show();
            break;
        case 'travellerSignup':
            $(".visiterSignUpForm").css("background", "#A9A9A9");
            $(".travellerSignUpForm").css("background", "#fff");
            $(".submit").hide();
            $(".continue").show();
            break;
        case 'signupProfil':
            $(".signup-box").hide();
            $(".signupProfil-box").show();
            break;
        default: 
            console.log('correctPopup can not be found!');
    }
}

function navigateToHomePage(operation, membershipId, membershipType){
    console.log(operation);
    switch(operation) {
        case 'continueWithoutMembership':
            let warning = "Üye olmadan devam ederseniz; paylaşımları değerlendiremez, gezginlerle iletişim kuramazsınız.";
            if (confirm(warning)) {
                window.location.href = "homepage.html";
            } 
            break;
        case 'login':
            alert('Giriş başarılı!');
            window.location.href = "homepage.html?userId="+membershipId+"&userType="+membershipType;
            break;
        case 'signup':
            alert('Anasayfaya yönlendiriliyorsunuz!');
            window.location.href = "homepage.html?userId="+membershipId+"&userType="+membershipType;
            break;

        default: 
            console.log('operation can not be found!');
			break;
    }
}

function controlLoginInfo(email, password){
    console.log(email, password);
    //todo: backend servisi ile kontrol et. Sonuca göre ok ya da error dön.
    var ItemJSON = JSON.stringify( {
        email: email,
        password: password
    })
    console.log(ItemJSON);
    
    var result = 'ok';
	var membershipId = null;
	var membershipType = null;
    
    URL = "http://localhost:8080/TravelCore/api/membership/login"; 
    var statusCode = 200; //ok
    
    var jsonResponse = postApi(ItemJSON, URL, statusCode);
    
    if (jsonResponse == null){
        result = 'error';
    } else {
		membershipId = jsonResponse.membershipId;
		membershipType = jsonResponse.membershipType;
	}
    //console.log(result);
	
    //return result;
	return [result, membershipId, membershipType];

}

function addMember(membershipType){
    console.log(membershipType);
    var ad= $('input[name=name]').val();
    var soyad= $('input[name=surname]').val();
    var email= $('input[name=username]').val();
    var parola= $('input[name=password1]').val();
    var type= membershipType; //todo: type = 'visiter' ve type= 'traveller' olarak belirledim. Backend'e başka bir değer gönderilmesi gerekiyor olabilir. addMember fonksiyonunda kontrol edilmeli.
    console.log(ad,soyad,email,parola,type);
    
    //todo: backend servisi ile üyeyi kaydet. Sonuca göre ok ya da error dön.  
    switch(type) {
        case 'visiter':
            type = 1;
            break;
        case 'traveller':
            type = 2;
            break;
    }
    
    var ItemJSON = JSON.stringify( {
        name: ad,
        surname: soyad,
        email: email,
        password1: parola,
        password2: parola,
        membershipType: type
    })
    console.log(ItemJSON);
    
    var result = 'ok';
    var membershipId = null;
	
    URL = "http://localhost:8080/TravelCore/api/membership/register"; 
    var statusCode = 201; //created
    
    var jsonResponse = postApi(ItemJSON, URL, statusCode);
    
    if (jsonResponse == null){
		console.log('error');
        result = 'error';
    } else {
    	membershipId = jsonResponse.membershipId;
	
		if(type = 2){

			// create profile
			var hakkında= $('textarea[name=hakkında]').val();
			console.log(hakkında);

			var ItemJSON2 = JSON.stringify( {
				membershipId: jsonResponse.membershipId,
				about: hakkında
			})
			console.log(ItemJSON2);

			URL2 = "http://localhost:8080/TravelCore/api/profile"; 

			postApi(ItemJSON2, URL2, statusCode);
		}
		
	}
    
    return [result, membershipId];
}

function controlPasswordIsValid(password, confirmPassword){
    console.log(password, confirmPassword);
    if(password == confirmPassword){
        return 'ok';
    }
    else {
        return 'password and confirmPassword are not same'
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
            //var membershipId = jsonResponse.membershipId;
        }
    }
    xmlhttp.send(ItemJSON);
    return jsonResponse;
    
}