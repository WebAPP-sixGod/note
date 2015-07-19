/*@params
	title:条目标题
	abstract:正文
	cTime:创建时间
*/
function item(obj) {
	this.title = obj.title;
	this.abstract = obj.abstract;
	this.cTime = obj.cTime;
}

/***************对象方法********************/
item.prototype.save = function(){}
item.prototype.update = function(){}
item.prototype.delete = function(){}

/***************类方法********************/
item.getAll = function(){}
item.getAllByClass = function(){}
item.getOne = function(){}

/*..つづく*/