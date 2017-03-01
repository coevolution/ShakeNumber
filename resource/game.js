function Game(percnt){
var percnt = percnt || 5;
var group = 1; 
var storage = [];
var storagedata = localStorage.getItem('lottery_data');
var $startbtn = $('startbtn');
var $stopbtn = $('stopbtn');
var $nextbtn = $('nextbtn');
var $anibox = $('rdlist');
var $reslist = $('reslist');
var $group  = $('group');
var $export = $('export');
var gstr = '';
if(storagedata){
 storage = JSON.parse(storagedata);
 storage.forEach(function(v,i){
	 gstr = '<div>'+(Math.floor(i/percnt)+1)+': '+ (i+1)+ ' '+ v+'</div>'+gstr;
	 if((i+1)%percnt==0) gstr = '<hr/>'+gstr;
	 var index = users.indexOf(v);
	 users.splice(index,1);
 });
 group = Math.ceil(storage.length/percnt+1);
 $group.innerHTML='第 '+group+' 轮';
 $reslist.innerHTML= gstr;
 if(users.length<1) $export.style.display='block';
}else{
 $group.innerHTML='第 1 轮';
}
var timer =0;
var starting = false;
var stoping = false;
var finish = false;
$('startbtn').onclick=function(){
  if(starting || stoping || finish) return;
  if(users.length<1){
	 alert('结束了');
	 finish = true;
	 $export.style.display='block';
	 return;
  }
  starting = true;
  timer = setInterval(function(){
	  users.sort(function(){return Math.random()-0.5;});
	  var str='',rdi = storage.length;
	  for(var i=0;i<percnt;i++){
		  if(users[i]){
			 rdi++;
			 str +='<p><span>'+rdi+'</span>'+users[i]+'</p>';
		  }
	  }
	  $anibox.innerHTML=str;
  },50);
};

$('stopbtn').onclick=function(){
   if(starting){
		var removes = users.splice(0,percnt);
		var index =0,tstr='',val=null;
		while(removes.length){
		   val = removes.shift();
		   index = storage.push(val);
		   tstr = '<div>'+(Math.floor((index-1)/percnt)+1)+': '+ index+ ' '+ val+'</div>'+tstr;
		}
		clearInterval(timer);
		starting = false;
		stoping = true;
		gstr = '<hr/>'+tstr+gstr
		$reslist.innerHTML= gstr;
		localStorage.setItem('lottery_data',JSON.stringify(storage));
		if(users.length<1){
		  $export.style.display='block';
		  finish=1;
		  stoping = false;
		  alert('结束了');
		}
   }
};
$('nextbtn').onclick=function(){
	if(stoping){
		stoping = false;
		$anibox.innerHTML='';
		$group.innerHTML='第 '+(++group)+' 轮';
	}
};
$export.onclick=function(){
  var codeWin = window.open();
  var str ="<style>table{border-collapse:collapse;border:1px solid #2d89ef;width:300px;font-size:12px;}td{border:1px solid #2d89ef;text-align:center;}";
  str +="th{font-weight:normal;border:1px solid #2d89ef;padding:5px 0;}td{width:50px;padding:5px 0;}td:last-child{width:200px;}</style>";
  str += '<table><tr><th>序号</th><th>组号</th><th>数据</th></tr>';
  storage.forEach(function(v,i){
	  str += '<tr><td>'+(i+1)+'</td><td>'+(Math.floor(i/percnt)+1)+'</td><td>'+v+'</td></tr>';
	});
  str+='</table>';
  codeWin.document.write(str);
  codeWin.document.close();
};

function $(ele){return document.getElementById(ele);}
$('reset').addEventListener('click',function(){
  if(storage.length){
	  if(confirm('确定要重置数据吗?\n\n重置后无法恢复')) {
		localStorage.removeItem('lottery_data');
		location.reload();
	  }
  }else{
		location.reload();
  }
},false);
}