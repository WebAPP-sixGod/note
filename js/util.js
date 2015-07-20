function getTime() {
	var d = new Date();
	return d.getFullYear() + '年' + addZero(d.getMonth()+1) + '月' + addZero(d.getDate()) + '日' + addZero(d.getHours()) + ':' + addZero(d.getMinutes());
}
function addZero(num) {
	if(num < 10) 
		return '0' + num;
	else
		return num
}
// 错误处理（待完善）
function error(info) {
	alert(info);
	location.reload();
}
// 成功提示（待完善）
function success(info) {
	alert(info);
	location.reload();
}
//展示条目
function showItem() {
	if(localStorage.getItem('index') && localStorage.getItem('index') != '') {
		var aItem = localStorage.getItem('index').split(',');
		aItem.forEach(functon(title){
			insertItem(title);
		});
	}
}
// 在容器内插入条目
function insertItem(title) {
	var o = JSON.parse(getItem(title));
	// 条目模板
	var tpl = '<p class="item-title">{0}</p>'
               + '<p class="item-abstract">{1}</p>';
    tpl.replace(/\{\d+\}/g, function(a,b){
    	console.log(a);
    	console.log(b);
    	/*施工中... tututu*/
    });
}