$(document).ready(function () {	
	/** 
	 * 解决IE不支持startWith方法等
	* 扩展startWith方法 
	* @param str 
	* @return 	* 
	*/ 
	String.prototype.startsWith=function(str){ 
	if(str==null||str==""||this.length==0||str.length>this.length) 
	return false; 
	if(this.substr(0,str.length)==str) 
	return true; 
	else 
	return false; 
	return true; 
	}; 


	/** 
	* 扩展contains方法 
	* @param item 
	* @return 
	*/ 
	Array.prototype.contains = function(item){ 
	return RegExp("\\b"+item+"\\b").test(this); 
	}; 


	/** 
	* IE不支持indexOf方法，为IE添加indexOf的方法 
	*/ 
	Array.prototype.indexOf = function(val){ 
	var value = this; 
	for(var i =0; i < value.length; i++){ 
	if(value[i] == val) return i; 
	} 
	return -1; 
	}; 
	
	//为Date 的原型添加格式化方法
	Date.prototype.format = function() { 
		 var fmt = "yyyy-MM-dd hh:mm:ss";
	     var o = { 
	        "M+" : this.getMonth()+1,                 //月份 
	        "d+" : this.getDate(),                    //日 
	        "h+" : this.getHours(),                   //小时 
	        "m+" : this.getMinutes(),                 //分 
	        "s+" : this.getSeconds(),                 //秒 
	        "q+" : Math.floor((this.getMonth()+3)/3), //季度 
	        "S"  : this.getMilliseconds()             //毫秒 
	    }; 
	    if(/(y+)/.test(fmt)) {
	            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	    }
	     for(var k in o) {
	        if(new RegExp("("+ k +")").test(fmt)){
	             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
	         }
	     }
	    return fmt; 
	} 
	
	//tbmIds = getTbmIds();	
//	$(".panel-header").click(function(){
//		$(this).next().toggle(500);		
//	});	
	btns = eval('('+btns+')');
	if(btns)
	{
		if(btns.admin!=undefined&&btns.admin!=true){
			$('a.easyui-linkbutton').each(function(){
				var text = this.text.trim();
				if(text=='添加')
				{
					if(!btns.add)
					{
						$(this).hide();
					}
				}
				
				else if(text=='删除')
				{
					if(!btns.remove)
					{
						$(this).hide();
					}
				}
				
				else if(text=='修改')
				{
					if(!btns.edit)
					{
						$(this).hide();
					}
				}
				
				else if(text=='保存')
				{
					if(!btns.save)
					{
						$(this).hide();
					}
				}
				
				else if(text=='导出')
				{
					if(!btns.download)
					{
						$(this).hide();
					}
				}
				
				else if(text=='上传')
				{
					if(!btns.download)
					{
						$(this).hide();
					}
				}
				
				else if(text=='生成')
				{
					if(!btns.create)
					{
						$(this).hide();
//						$(this).prop('disabled',true);
					}
				}
			});
		}
	}
});

function initCombobox(id,data,value){
	$("#"+id).combobox({
		valueField:'id',    
	    textField:'text',   
	    data:data,
	    value:value
	});
}

function initCombox(cc,opts)
{
	$('#'+opts+' input').click(function(){
		var val = $('#'+cc).combo('getValue');
		var text = $('#'+cc).combo('getText');
		var v = $(this).val();
		var s = $(this).next('span').text();
		if(!val)
		{
			val=v;
			text=s;
		}
		else
		{
			if(!isContain(v,val))
			{
					val+=','+v;
					text+=';'+s;
			}		
		}
		$('#'+cc).combo('setValue', val).combo('setText', text);		
	});
}

//全选
function fillCC(cc,opts)
{
	resetCC(cc,opts);
	var val = '';
	var text = '';
	
	$('#'+opts+' input').each(function(){
		$(this).prop('checked',true);
		var v =  $(this).val();
		var s = $(this).next('span').text();
		if(val=='')
		{
			val = v;
			text = s;
		}
		else
		{
			val += ','+v;
			text += ','+s;
		}	
	});
	
	$('#'+cc).combo('setValue', val).combo('setText', text).combo('hidePanel');		
}
//全部重置
function resetCC(cc,sp)
{	
	$('#'+sp+' input').each(function(){
		$(this).prop('checked',false);
	});
	$('#'+cc).combo('setText','');
	$('#'+cc).combo('setValue','');
}

function editCombox(cc,opts,ary)
{
	var val = '';
	var text = '';
	for(var i=0;i<ary.length;i++)
	{
		if(ary[i])
		{
			var dom = $('#'+opts+' input[value='+ary[i]+']');
			dom.prop('checked',true);
			var v = dom.val();
			var s = dom.next('span').text();
			if(val == '')
			{
				val = v;
				text = s;
			}
			else
			{
				val += ','+v;
				text += ','+s;					
			}
		}
		$('#'+cc).combo('setValue', val).combo('setText', text).combo('hidePanel');		
	}
}

//建立省市区县信息
function initProvince()
{
	$.ajax( {    
 	    url:basePath+"sys/getAreasByPcode.action",
 	    type:'post',    
 	    cache:false,    
 	    async: false,
 	    dataType:'json',    
 	    data:{
 	    	pcode:'000000'
 	    },
 	    success:function(data) {  
 	    	data.splice(0,0,{'areacode':'000000','areaname':'请选择省份','id':0,'layer':0,'pcode':'000000','pname':'请选择省份'});
 	    	$('#province').combobox('loadData',data);
 	     },    
 	     error : function() {    
 	          alert("异常！","error");    
 	     }    
 	});
}

function initCity(pcode)
{
	$.ajax( {    
		url:basePath+"sys/getAreasByPcode.action",
		type:'post',    
		cache:false,    
		async: false,
		dataType:'json',    
		data:{
			pcode:pcode
		},
		success:function(data) {  
			data.splice(0,0,{'areacode':'000000','areaname':'请选择城市','id':0,'layer':0,'pcode':'000000','pname':'请选择城市'});
			$('#city').combobox('loadData',data);
		},    
		error : function() {    
			alert("异常！","error");    
		}    
	});
}

function initTown(pcode)
{
	$.ajax( {    
		url:basePath+"sys/getAreasByPcode.action",
		type:'post',    
		cache:false,    
		async: false,
		dataType:'json',    
		data:{
			pcode:pcode
		},
		success:function(data) {  
			data.splice(0,0,{'areacode':'000000','areaname':'请选择区县','id':0,'layer':0,'pcode':'000000','pname':'请选择区县'});
			$('#town').combobox('loadData',data);
		},    
		error : function() {    
			alert("异常！","error");    
		}    
	});
}

function isContain(v,val)
{
	var ary = val.split(',');
	for(var i=0;i<ary.length;i++)
	{
		if(v==ary[i])
		{
			return true;
		}
	}
	return false;
}
//function getSysTbms(){
//	$.ajax( {    
//		url:basePath+"sys/getSysTbms.action",
//		type:'post',    
//		cache:false,    
//		async: false,
//		dataType:'json',    
//		success:function(data) {  	
//			for(var i=0;i<data.length;i++)
//			{
//				var id = data[i].id;
//				var text = data[i].text;
//				var input = '<input type="radio"  width="100px"  value='+id+'><span>'+text+'</span><br/>';
//				$('#opts').append(input);    
//			}
//		},    
//		error : function() {    
//			alert("异常！");    
//		}    
//	});  
//};

//对op_num进行加工，获取距离10最近的点
function subOpNum(num){
	if(num%10==0)
	{
		return num;
	}
	else
	{
		var yu = num%10;
		if(yu<=5)
		{
			return num-yu;
		}
		else
		{
			return num-yu+10;
		}
	}
}

function resetForm(id)
{
	$('#'+id).form('clear');
}

$.extend($.fn.validatebox.defaults.rules, {				
	CHS: {					
		validator: function (value, param) {	
			return /^[\u0391-\uFFE5]+$/.test(value);
			},
			message: '请输入汉字'	
		},	
	english : {
		// 验证英语
		validator : function(value)
		{
			return /^[A-Za-z]+$/i.test(value);
		},
		message : '请输入英文'
	},
	ip : {
			// 验证IP地址
			validator : function(value) {
				return /\d+\.\d+\.\d+\.\d+/.test(value);
			},
			message : 'IP地址格式不正确'
		},
	ZIP: {
		validator: function (value, param){
			return /^[0-9]\d{5}$/.test(value);
			},
			message: '邮政编码不存在'
	},				
	QQ: {
		validator: function (value, param) {
			return /^[1-9]\d{4,10}$/.test(value);
		},
		message: 'QQ号码不正确'
	},				
	mobile: {
		validator: function (value, param) {
			return /^(?:13\d|15\d|18\d)-?\d{5}(\d{3}|\*{3})$/.test(value);
		},
		message: '手机号码不正确'	
	},				
	tel:{
		validator:function(value,param){
			return /^(\d{3}-|\d{4}-)?(\d{8}|\d{7})?(-\d{1,6})?$/.test(value);	
		},
		message:'电话号码不正确'
	},				
	mobileAndTel: {
		validator: function (value, param) {
			return /(^([0\+]\d{2,3})\d{3,4}\-\d{3,8}$)|(^([0\+]\d{2,3})\d{3,4}\d{3,8}$)|(^([0\+]\d{2,3}){0,1}13\d{9}$)|(^\d{3,4}\d{3,8}$)|(^\d{3,4}\-\d{3,8}$)/.test(value);
		},
		message: '请正确输入电话号码'
	},				
	number: {
		validator: function (value, param) {
			return /^[0-9]+.?[0-9]*$/.test(value);
		},
		message: '请输入数字'
	},
	money:{
		validator: function (value, param) {
			return (/^(([1-9]\d*)|\d)(\.\d{1,2})?$/).test(value);
		},
		message:'请输入正确的金额'
	},				
	mone:{
		validator: function (value, param) {
			return (/^(([1-9]\d*)|\d)(\.\d{1,2})?$/).test(value);
		},
		message:'请输入整数或小数'
	},
	integer:{
		validator:function(value,param){
			return /^[+]?[1-9]\d*$/.test(value);
		},
		message: '请输入最小为1的整数'
	},
	integ:{
		validator:function(value,param){
			return /^[+]?[0-9]\d*$/.test(value);
			},
		message: '请输入整数'
	},				
	range:{
		validator:function(value,param){	
			if(/^[1-9]\d*$/.test(value)){	
				return value >= param[0] && value <= param[1]	
			}else{	
				return false;		
			}	
		},
		message:'输入的数字在{0}到stagza之间'
	},
	minLength:{	
		validator:function(value,param){	
			return value.length >=param[0]
		},	
		message:'至少输入{0}个字'	
	},		
	maxLength:{
		validator:function(value,param){
			return value.length<=param[0]	
			},	
		message:'最多{0}个字'
	},	
	//select即选择框的验证
	selectValid:{	
		validator:function(value,param){	
			if(value == param[0]){	
				return false;
			}else{
				return true ;	
			}
		},
		message:'请选择'	
	},
	idCode:{
		validator:function(value,param){	
			return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
			},
	 message: '请输入正确的身份证号'	
  },
  loginName: {	
	  validator: function (value, param) {	
		  return /^[\u0391-\uFFE5\w]+$/.test(value);	
	  },	
	  message: '登录名称只允许汉字、英文字母、数字及下划线。'		
  },				
  equalTo: {
	  validator: function (value, param) {	
		  return value == $(param[0]).val();	
	  },
	  message: '两次密码输入不一致'	
	},
	englishOrNum : {
		// 只能输入英文和数字
		validator : function(value) {
			return /^[a-zA-Z0-9_ ]{1,}$/.test(value);
		},
		message : '请输入英文、数字、下划线或者空格'
	},
	xiaoshu:{ 
		validator : function(value){
			return /^(([1-9]+)|([0-9]+\.[0-9]{1,2}))$/.test(value);	
		}, 
		message : '最多保留两位小数！'
	},
	ddPrice:{
		validator:function(value,param){
			if(/^[1-9]\d*$/.test(value)){
				return value >= param[0] && value <= param[1];
			}else{	
				return false;
			}
		},
		message:'请输入1到100之间正整数'	
	},
	jretailUpperLimit:{	
		validator:function(value,param){	
			if(/^[0-9]+([.]stagza[0-9]{1,2})?$/.test(value)){	
				return parseFloat(value) > parseFloat(param[0]) && parseFloat(value) <= parseFloat(param[1]);	
			}else{
				return false;	
			}
		},
		message:'请输入0到100之间的最多俩位小数的数字'
	},
	rateCheck:{
		validator:function(value,param){
			if(/^[0-9]+([.]stagza[0-9]{1,2})?$/.test(value)){
				return parseFloat(value) > parseFloat(param[0]) && parseFloat(value) <= parseFloat(param[1]);	
			}else{
				return false;
			}
		},
		message:'请输入0到1000之间的最多俩位小数的数字'
	},
	userName:{
		validator:function(value,param){
			if(/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)){
				return (value.length >=6)&&(value.length<=12);	
			}else{
				return false;
			}
		},
		message:'请输入6~18个字符，可使用字母、数字、下划线，并以字母开头'
	},
	uniqueUserName:{
		validator:function(value){
			$.ajax({
				url : basePath + "sysUser/checkUniqueUserName.action",
				type : 'post',
				data : {
					'user_name' : value
				},
				cache : false,
				async : false,
				dataType : 'json',
				success : function(data) {
					return data;
				},
				error : function(e) {
					return false;
				}
			});
		},
		message:'此用户名已被申请，请输入其它'
	},	
	mail:{
		validator:function(value,param){
			return(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value));
		},
		message:'邮箱格式不对'
	}
});	

$.extend($.fn.datagrid.defaults,{
	fit:true
});

function getTbmIds()
{
	var val = null;
	$.ajax( {    
		url:basePath+"sysTbmInfo/getSysTbmInfos.action", 
		type:'post',    
		cache:false,    
		async:false,
		dataType:'json',    
		success:function(data) {  
			val = data.rows;				
		},    
		error : function() {    
			alert("查询数据为空","error");    
		}    
	});  
	return val;
}

function getAllTbmIds()
{
	var val = '';
	$.ajax( {    
		url:basePath+"common/getAllTbmIds.action", 
		type:'post',    
		cache:false,    
		async:false,
		dataType:'json',    
		success:function(data) {  
			val = data;				
		},    
		error : function() {    
			alert("查询数据为空","error");    
		}    
	});  
	return val;
}

//请求TBM数据
function getTbmInfo() {
	var val = '';
	$.ajax({
		url : basePath + "common/getTbmInfo.action",
		type : 'post',
		cache : false,
		async : false,
		dataType : 'json',
		success : function(data) {
			val = data;
		}
	});
	return val;
}