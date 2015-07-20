/*@params
	class:类别
	title:条目标题(当做主键)
	abstract:正文
	cTime:创建时间
*/
function Item(obj) {
	this.class = obj.class;
	this.title = obj.title;
	this.abstract = obj.abstract;
	this.cTime = obj.cTime;
}

/***************对象方法********************/
Item.prototype.save = function(callback){
	var o = {
		'class': this.class,
		'title': this.title,
		'abstract': this.abstract,
		'cTime': this.cTime
	}
	// 检测是否存在
	if(localStorage.getItem(o.title)) {
		return callback('Already exsit!');
	}
	// 插入index
	if(localStorage.getItem('index') && localStorage.getItem('index') != ''){
		localStorage.setItem('index', localStorage.getItem('index') + ',' + o.title);
	} 
	else 
		localStorage.setItem('index', o.title);
	// 创建条目
	localStorage.setItem(o.title, JSON.stringify(o));
	return callback(null);
}
Item.prototype.update = function(){}
Item.prototype.delete = function(){}

/***************类方法********************/
Item.getAll = function(){}
Item.getAllByClass = function(){}
Item.getOne = function(){}

/*..つづく*/