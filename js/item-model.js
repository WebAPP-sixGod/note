/*@params
	class:类别
	title:条目标题(当做主键)
	abstract:正文
	cTime:创建时间
	img:画板图片编码
	type:Item类型 0:markdown, 1:图片
*/
function Item(obj) {
	this.class = obj.class;
	this.title = obj.title;
	this.abstract = obj.abstract;
	this.markedAbstract = obj.markedAbstract;
	this.cTime = obj.cTime;
	this.type = obj.type;
	this.img = obj.img;
}

/***************对象方法********************/
Item.prototype.save = function(callback){

	var o = {
		'class': this.class,
		'title': this.title,
		'abstract': this.abstract,
		'markedAbstract': this.markedAbstract,
		'cTime': this.cTime,
		'type' : this.type,
		'img' : this.img
	}
    // title不能为空
    if(!o.title) {
        return callback('标题要写*3');
    }
	// 检测是否存在
	if(localStorage.getItem(o.title)) {
		return callback('这条笔记已经存在了，换个名字吧');
	}
	// 插入index
	if(localStorage.getItem('index') && localStorage.getItem('index') != ''){
		localStorage.setItem('index', localStorage.getItem('index') + ',' + o.title);
	} 
	else {
		localStorage.setItem('index', o.title);
	}
	// 创建条目
	localStorage.setItem(o.title, JSON.stringify(o));
	return callback(null);
}

Item.prototype.update = function(callback){
	var o = {
		'class': this.class,
		'title': this.title,
		'abstract': this.abstract,
		'markedAbstract': this.markedAbstract,
		'cTime': this.cTime,
		'type' : this.type,
		'img' : this.img
	}
	// 创建条目
	localStorage.setItem(o.title, JSON.stringify(o));
	return callback(null);
}


/***************类方法********************/
Item.delete = function(title, callback) {
	var a = localStorage.getItem('index').split(',');
	if(!localStorage.getItem(title)) {
		return callback('删除失败：不存在此条目');
	}
	a.forEach(function(value, index, array) {
		if(value == title){
			array.splice(index, 1);
			if(array.length != 0) {
				localStorage.setItem('index', array.join(','));
			}
			else {
				localStorage.removeItem('index');
			}
			localStorage.removeItem(value);
			return callback(null);
		}
	})
}
Item.getNumByClass = function(Class) {
	if(!localStorage.getItem('index')) {
		return 0;
	}
	var aItem = localStorage.getItem('index').split(',');
	var sum = 0;
	aItem.forEach(function(value, index, arr){
		if(JSON.parse(localStorage.getItem(value)).class === Class) {
			sum++;
		}
	});
	return sum;
}
// 根据class来查询笔记
Item.getByClass = function(Class, callback){
	if(!localStorage.getItem('index')) {
		return callback('先存条笔记吧');
	}
	var aItem = localStorage.getItem('index').split(',');
	var result = [];
	aItem.forEach(function(value, index, arr){
		if(JSON.parse(localStorage.getItem(value)).class === Class) {
			result.push(value);
		}
	});
	return callback(null, result);
}
// 清空笔记中的（class = Class）class属性
Item.clearClass = function(Class, callback){
	if(!localStorage.getItem('index')) {
		return 0;
	}
	var aItem = localStorage.getItem('index').split(',');
	var result = [];
	var o;
	aItem.forEach(function(value, index, arr){
		o = JSON.parse(localStorage.getItem(value));
		if(o.class === Class) {
			o.class = '';
			localStorage.setItem(value, JSON.stringify(o));
			result.push(value);
		}
	});
	// 返回改动的数组
	return callback(null, result);
}
