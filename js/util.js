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
    var tpl = '<div class="item"><p class="item-title">'+ o.title +'</p>'+ '<p class="item-abstract">'+ o.abstract +'</p><button class="itemEdit">编辑</button><button class="itemDelete">删除</button><span class="item-time">' + o.cTime + '</span></div>';
    var itemEntry = $('.items');
    itemEntry.append(tpl);
}
function init_event() {
	/*初始化新增元素事件
    */
    $(document).on('click', '#submit-add', function(){
        $('#detail-section > div').hide();
        $('#form-add').show(200);
        var title = $('#form-add .input-title').val(),
            abstract = $('#form-add .input-abstract').val(),
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
            disDetail(o);
            return success('添加成功'); 
        });
    });
	// 编辑元素(使用子查询可以优化jquery选择器速度)
	$(document).on('click', '.item .itemEdit', function(e) {
        e.stopPropagation();
        var othis = $(e.target);
		var clicked = $(this);
		var currenDiv = clicked.prevAll();
		var itemTitle = currenDiv[1].innerHTML;
		var itemAbstract = currenDiv[0].innerHTML;
		var currentItem = JSON.parse(localStorage.getItem(itemTitle));

        $('#detail-section > div').hide();
        $('#form-edit').show(200);
		//将目前目录更新到编辑栏
		$('#form-edit .input-title').attr('value', itemTitle);
		$('#form-edit .input-abstract').val(itemAbstract);
		//将编辑结果更新到localStorage
		$('#update-add').one('click', function() {
            // 连续修改时存在一个bug：Uncaught TypeError: Cannot set property 'title' of null
			var clicked = $(this);
			var changedItem = clicked.prevAll(); 
			var changedItemTitle = changedItem.find('input').val();
			var changedItemAbstract = changedItem.find('textarea').val();
            console.log(changedItemTitle);
            console.log(changedItemAbstract);
			var o = JSON.parse(localStorage.getItem(itemTitle));
			o.title = changedItemTitle;
			o.abstract = changedItemAbstract;
			var item = new Item(o);
			if (changedItemTitle != itemTitle) {
				//删除元素使用Item.delete方法，该方法会删除index里面的索引和localStorage里面的item
				// 删除旧条目
                Item.delete(itemTitle, function(err) {
					if(err) {
						return error(err);
					}
                    // 创建新条目
					item.save(function(err){
			            if(err) {
			                return error(err);
			            }
			        });
				});
				
			} else {
				item.update(function(){});
			}
            showItem();
            disDetail(o);
            //dom被刷新了，所以事件无法触发
            return success('修改成功');
		});
	});
	// 删除元素
	$(document).on('click', '.item .itemDelete', function(e){
        e.stopPropagation();
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
    // 查看详情
    $(document).on('click', '.item', function(e){
        var title;
        if($(e.target).prop('class') == 'item') {
            title = $(e.target).children('.item-title').text();
        } else {
            title = $(e.target).parent('.item').children('.item-title').text();
        }
        var o = JSON.parse(localStorage.getItem(title));
        disDetail(o);
    });
    // 新增条目菜单事件
    $('#form-add-trigger').on('click', function() {
        $('#detail-section > div').hide();
        $('#form-add').show(200);
    });
    // 新增笔记本事件
    $('#add-class-trigger').on('click', function(){
        var oContainer = $('#form-add-class');
        oContainer.removeClass('display-none');
        $('#submit-class').one('click', function() {
            var className = oContainer.children('input').val();
            // 过滤纯空格类名
            if(!className.replace(/\s+/g,"")) {
                error('类名不能为空');
            } else {
                var li = '<li>'
                            + className +
                            + '(<span class="item-number">'
                            + Item.getNumByClass(className);
                            + '</span>)</li>';
                if(localStorage.getItem('class')){
                    localStorage.setItem('class', localStorage.getItem('class') + ',' + className);
                } 
                else {
                    localStorage.setItem('class', className);
                }
                $('#item-class').append(li);
            }
        });

    });
}
function disDetail(o) {
    console.log(o);
    $('#detail-section > div').hide();
    $('#item-detail-title h1').text(o.title);
    $('#item-detail-abstract p').text(o.abstract);
    $('#item-detail').show(500);
}