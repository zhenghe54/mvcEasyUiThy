/**
 * 反馈的页面的js文档
 */
// 点击下拉
function startFeedback() {
	$('.userfd').slideDown();
}

// 邮箱自动补全
$(function() {
	var mailList = new Array('@qq.com', '@163.com', '@126.com', '@gmail.com',
			'@sina.com', '@outlook.com', '@139.com', '@yeah.com');
	$("#email").bind(
			"keyup",
			function() {
				var val = $(this).val();
				if (val == '' || val.indexOf("@") > -1) {
					$(".emaillist").hide();
					return false;
				}
				$('.emaillist').empty();
				for (var i = 0; i < mailList.length; i++) {
					var emailText = $(this).val();
					$('.emaillist').append(
							'<li class=addr>' + emailText + mailList[i]
									+ '</li>');
				}
				$('.emaillist').show();
				$('.emaillist li').click(function() {
					$('#email').val($(this).text());
					$('.emaillist').hide();
					emailvertify();
				})
			})
})
// 邮箱验证
function emailvertify() {
	var email = $('#email').val();
	var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if (!regex.test(email)) {
		$('#email-correct').hide();
		$('.email-error').show();
		$('#email-nessarry').hide();
		return false;
	} else {
		$('#email-correct').show();
		$('.email-error').hide();	
		$('#email-nessarry').hide();
		return true;
	}
}
// 电话号码验证
function telvertify() {
	
	var telephone = $('#telephone').val();
	var regex = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;// 手机号码的校验
	var regex1 = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;// 电话号码的校验
	if (telephone.length != 0) {
		if (!regex.test(telephone) || !regex1.test(telephone)) {
			$('.tel-error').show();
			$('#tel-correct').hide();
			return false;
		} else {
			$('.tel-error').hide();
			$('#tel-correct').show();
			return true;
		}
	} else {
		$('.tel-error').hide();
		$('#tel-correct').hide();
	}

}
// textarea输入是否为空的验证
function advicevertify() {
	var advice = $('#advice').val();
	if (advice.length == 0) {
		$('.advice-error').show();
		$('#advice-correct').hide();
		$('#advice-nessarry').hide();
		return false;
	} else {
		$('.advice-error').hide();
		$('#advice-correct').show();
		$('#advice-nessarry').hide();
		return true;
	}
}
// 剩余字符数检验
function wordcheck() {
	var maxLength = 400;
	var advice = document.getElementById("advice").value;
	var targetLength = wordLength(advice);
	var leftLength = maxLength - targetLength;
	document.getElementById("wordcheck").innerHTML = leftLength;
}
// 字符的长度检测
function wordLength(val) {
	var nativecode = val.split("");
	var len = 0;
	for (var i = 0; i < nativecode.length; i++) {
		var code = Number(nativecode[i].charCodeAt(0));
		if (code > 127) {
			len += 2;
		} else {
			len++
		}
	}
	return len;
}
// ajax提交数据
// 调用ajax进行传递数据
function subAjax(obj) {
	$.ajax({
		type : "post",
		url : basePath + 'sysFeedback/addFeedback.action', // 需要提交的 url
		data : obj,
		cache : false,
		success : function(data) { // data 保存提交后返回的数据
			// 此处可对 data 作相关处理
			alert('提交成功！');
			resetfrom();
		},
		async : true
	});
}

function submitFeedback() {
	var contenType = "";
	$('input[type="checkbox"]:checked').each(function() {
		contenType = contenType + $(this).val();
	})
	var email = $('#email').val(), telephone = $('#telephone').val(), advice = $(
			'#advice').val();
	var regex = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	var obj = new Object();
	obj.contenType = contenType;
	obj.email = email;
	obj.telephone = telephone;
	obj.advice = advice;
	if (!emailvertify()) {
		alert("请您输入正确邮箱！");
		return;
	}
	if (!advicevertify()) {
		alert("辛苦一下，给些建议吧！");
		return;
	}

	var inputfile = $('#inputfile').val();
	if (inputfile != "") {
		var file1 = ($('#inputfile')[0]).files[0];
		var filename2 = $('#inputfile').val();
		if (window.FileReader) {
			var fr = new FileReader();
			fr.onloadend = function(e) {
				var data = e.target.result;
				obj.file = data;
				obj.filename = filename2;
				subAjax(obj);
			};
			fr.readAsDataURL(file1);
		} else {
			alert("您的浏览器不支持windows API");
		}

	} else {
		subAjax(obj);
	}
}
//预览图片
function prevImg(file) {
	if(file!=null)
	{
		$('#preImg').show();
		var prevDiv = document.getElementById('preImg');
		if (file.files && file.files[0]) {
			var reader = new FileReader();
			reader.onload = function (evt) {
				prevDiv.innerHTML = '<img src="' + evt.target.result + '" />';
			};
			reader.readAsDataURL(file.files[0]);
		}
	}
}


//预览图片清空

function resetImg(){
	$('#preImg').hide();
}



// 剩余字数清空
function resetwordLength() {
	$('#wordcheck').html("400");
}
function resetfrom() {
	$('.email-error').hide();
	$('.advice-error').hide();
	$('#email-nessarry').show();
	$('#advice-nessarry').show();
	$('#email-correct').hide();
	$('.tel-error').hide();
	$('#tel-correct').hide();
	$('#advice-correct').hide();
	$('#form1')[0].reset();
	resetwordLength();
	resetImg();
}
