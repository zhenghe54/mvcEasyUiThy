var tbmId = parent.tbmId;
$(document).ready(function () {	
	activeMenu(parent.currentId);
	thereSomeThingAboutMe.run({
		random : false,
		pictures : [ imgBasePath+'01.jpg', imgBasePath+'02.jpg', imgBasePath+'03.jpg', imgBasePath+'04.jpg' ],
		inAnimation : 'flipInX',
		outAnimation : 'bounceOut'
	});	
});

function activeMenu(id){
	$("#"+id).addClass("menu-active");
	$("#"+id).click(function(event){
		return false;
	});
}

function forwardOtherSystem(systemCode){
	if(tbmId){
		window.open("/forwardOtherSystem.do?tbmId="+tbmId+"&&systemCode=" + systemCode);	
	}
	else{
		window.open("/forwardOtherSystem.do?systemCode=" + systemCode);		
	}
}

