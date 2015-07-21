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
	return alert(info);
}
// 成功提示（待完善）
function success(info) {
	return alert(info);
}
//展示条目
function showItem() {
	/*1.清空旧元素
	  2.插入新元素
	  3.为新元素初始化事件
	 */
	$('.items').empty();
	if(localStorage.getItem('index') && localStorage.getItem('index') != '') {
		var aItem = localStorage.getItem('index').split(',');
		aItem.forEach(function(title){
			insertItem(title);
		});
	}
}
// 在容器内插入条目
function insertItem(title) {
	var o = JSON.parse(localStorage.getItem(title));
	// 条目模板
    var tpl = '<div class="item"><p class="item-title">'+ o.title +'</p>'+ '<p class="item-abstract">'+ o.abstract +'</p><button class="itemEdit">编辑</button><button class="itemDelete">删除</button></div>';
    var itemEntry = $('.items');
    itemEntry.append(tpl);
}
function init_event() {
	/*初始化新增元素事件
    */
    $(document).on('click', '#submit-add', function(){
        var title = $('#form-add #input-title').val(),
            abstract = $('#form-add #input-abstract').val(),
            o = {
                'class': '',
                'title': title,
                'abstract': abstract,
                'cTime': getTime()
            }
        var item = new Item(o);
        item.save(function(err){
            if(err) {
                return error(err);
            }
            //更新条目
            showItem();
            return success('添加成功'); 
        });
    });
	// 编辑元素(使用子查询可以优化jquery选择器速度)
	$(document).on('click', '.item .itemEdit', function() {
		var clicked = $(this);
		var currenDiv = clicked.prevAll();
		var itemTitle = currenDiv[1].innerHTML;
		var itemAbstract = currenDiv[0].innerHTML;
		var currentItem = JSON.parse(localStorage.getItem(itemTitle));
		console.log(currentItem);
		//将目前目录更新到编辑栏
		$('#input-title').attr('value', itemTitle);
		$('#input-abstract').val(itemAbstract);
		$('#submit-add').prop('disabled', true);
		$('#update-add').prop('disabled', false);
		//将编辑结果更新到localStorage
		$('#update-add').on('click', function() {
			var clicked = $(this);
			var changedItem = clicked.prevAll();
			var changedItemTitle = changedItem.find('input').val();
			var changedItemAbstract = changedItem.find('textarea').val();
			var o = JSON.parse(localStorage.getItem(itemTitle));
			o.title = changedItemTitle;
			o.abstract = changedItemAbstract;
			var item = new Item(o);
			if (changedItemTitle != itemTitle) {
				//删除元素使用Item.delete方法，该方法会删除index里面的索引和localStorage里面的item
				Item.delete(itemTitle, function(err) {
					if(err) {
						return error(err);
					}
					item.save(function(err){
			            if(err) {
			                return error(err);
			            }
			            //更新条目
			            showItem();
			            return success('修改成功'); 
			        });
				});
				
			} else {
				item.save(function(err){
		            if(err) {
		                return error(err);
		            }
		            //更新条目
		            showItem();
		            return success('修改成功'); 
		        });
			}
		});
	});
	// 删除元素
	$(document).on('click', '.item .itemDelete', function(e){
		if(!confirm('确定要删除？'))
			return ;
		var title = $(e.target).siblings('.item-title').text();
		Item.delete(title, function(err) {
			if(err) {
				return error(err);
			}
			showItem();
			return success('删除成功');
		})
	});
}