var itemsDiv = $('.items');//笔记条目容器


function getTime() {
	var d = new Date();
	return d.getFullYear() + '年' + addZero(d.getMonth()+1) + '月' + addZero(d.getDate()) + '日' + addZero(d.getHours()) + ':' + addZero(d.getMinutes());
}


function addZero(num) {
	if(num < 10) 
		return '0' + num;
	else
		return num;
}


// 错误处理（待完善）
function error(info) {
	return alert(info);
}


// 成功提示（待完善）
function success(info) {
	return alert(info);
}
//加载所有条目和分类
function showAllItem() {
	/*1.清空旧元素
	  2.插入新元素
	  3.更新分类数据
	 */
	itemsDiv.empty();
	if(localStorage.getItem('index')) {
		var aItem = localStorage.getItem('index').split(',');
		insertItem(aItem);
	}
    // 更新分类数据
    $('#item-class').empty();
    if(localStorage.getItem('class')) {
        var aClass = localStorage.getItem('class').split(',');
        insertClass(aClass);
    }
}


// 在容器内插入条目
function insertItem(arr) {
    var itemEntry = itemsDiv,
        o,tpl;
    arr.forEach(function(title, index) {
        o = JSON.parse(localStorage.getItem(title));
        // 条目模板
        tpl = '<div class="item"><p class="item-title">'+ o.title +'</p>'+ '<p class="item-abstract">'+ o.abstract +'</p><button class="itemEdit">编辑</button><button class="itemDelete">删除</button><span class="item-time">' + o.cTime + '</span></div>';
        
        itemEntry.append(tpl);
    });
}
function disDetail(o) {
    $('#detail-section > div').hide();
    $('#item-detail-title h1').text(o.title);
    $('#item-detail-info .time').text(o.cTime);
    $('#item-detail-info .class').text(o.class||'无');
    //$('#item-detail-abstract div').text(o.abstract);
    //因为marked解析的到的是html语句，所以可以直接append上去。
    $('#item-detail-abstract #abstract-container').empty().html(o.markedAbstract);
    $('#item-detail').show(500);
}
function insertClass(arr) {
    var li,
        oContainer = $('#item-class');
    arr.forEach(function(value, index, array) {
        li = '<li data-class="'
            + value
            + '">'
            + value 
            + '('
            + Item.getNumByClass(value)
            + ')<a class="pull-right class-delete-trigger color-gray">x</a></li>';
        oContainer.append(li);
    });
}
function insertSelectClass() {
    var option,
        oContainer = $('.select-class'),
        aClass;
        oContainer.empty().append('<option value="">无分类</option>');
        if(localStorage.getItem('class')) {
            aClass = localStorage.getItem('class').split(',');
            aClass.forEach(function(value, index, array) {
                option = '<option value="'
                    + value
                    + '">'
                    + value 
                    + '</option>';
                oContainer.append(option);
            });
        }
}
function checkSameClass(Class) {
    if(!localStorage.getItem('class')) {
        return 0;
    }
    var aClass = localStorage.getItem('class').split(','),
        flag = 0;
    aClass.forEach(function(value, index, arr) {
        if(value == Class) {
            // 存在重复，返回1
            flag = 1;
        }
    });
    return flag;
}
function init_event() {
	/*初始化新增元素事件
    */
    $(document).on('click', '#submit-add', function(){
        $('#detail-section > div').hide();
        $('#form-add').show(200);
        var title = $('#form-add .input-title').val(),
            abstract = $('#form-add .input-abstract').val(),
            parseResult = markedParser(abstract),
            o = {
                'class': $('#form-add select').val(),
                'title': title,
                'abstract': abstract,
                'markedAbstract': parseResult,
                'cTime': getTime()
            }
        var item = new Item(o);
        item.save(function(err){
            if(err) {
                return error(err);
            }
            //更新条目
            showAllItem();
            disDetail(o);
            //确保下次输入栏为空
            $('.input-title').text('');
            return success('添加成功'); 
        });
    });


	// 编辑元素(使用子查询可以优化jquery选择器速度)
	$(document).on('click', '.item .itemEdit', function(e) {
        e.stopPropagation();
        var othis = $(e.target);
		var itemTitle = othis.siblings('.item-title').text();
        var currentItem = JSON.parse(localStorage.getItem(itemTitle));
        var itemClass = currentItem.class;
		var itemAbstract = currentItem.abstract;

        insertSelectClass();

        $('#detail-section > div').hide();
        $('#form-edit').show(200);

		//将目前目录更新到编辑栏
		$('#form-edit .input-title').attr('value', itemTitle);
        $('#form-edit .select-class').val(itemClass);
		$('#form-edit .input-abstract').val(itemAbstract);

		//将编辑结果更新到localStorage
		$('#update-add').one('click', function() {
			var clicked = $(this);
			var changedItem = clicked.prevAll(); 
			var changedItemTitle = changedItem.find('input').val();
            var changeItemClass = changedItem.find('select').val();
			var changedItemAbstract = changedItem.find('textarea').val();         
			var o = JSON.parse(localStorage.getItem(itemTitle));

            // 创建更新后的item对象
			o.title = changedItemTitle;
            o.class = changeItemClass;
            //Markdown解析，将markdown语句解析成html语句
            o.abstract = changedItemAbstract;
            o.markedAbstract = markedParser(changedItemAbstract);
			var item = new Item(o);

			if (changedItemTitle != itemTitle) {
				// 检查修改后的title是否会重复
                if(!localStorage.getItem(changedItemTitle)) {
                    //删除元素使用Item.delete方法，该方法会删除index里面的索引和localStorage里面的item
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
                }
                else {
                    $(e.target).trigger('click');
                    return error('这个标题重复了，换个呗~');
                }
			} else {
				item.update(function(){});
			}
            showAllItem();
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
			showAllItem();
            $('#detail-section>div').hide();
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
        //清除内容，不然disDetail会一直往上面append内容
        $('#abstract-container').empty();
        disDetail(o);
    });

    // 删除分类
    $(document).on('click', '.class-delete-trigger', function(e) {
        e.stopPropagation();
        if(!confirm('确定要删除？')) {
            return 0;
        }
        var aClass = localStorage.getItem('class').split(','),
            deleteClass = $(e.target).parent().data('class');
        aClass.forEach(function(value, index, array) {
            if(value == deleteClass){
                array.splice(index, 1);
                if(array.length != 0) {
                    localStorage.setItem('class', array.join(','));
                }
                else {
                    localStorage.removeItem('class');
                }
                Item.clearClass(deleteClass, function(err, result) {
                    if(err) {
                        return error(err);  
                    }
                });
                showAllItem();
                return success('删除成功');
            }
        });
    });

    // 按类别筛选
    $(document).on('click', '#item-class li', function(e) {
        var thisClass = $(e.target).data('class');
        Item.getByClass(thisClass, function(err, result) {
            if(err) {
                return error(err);
            }
            itemsDiv.empty();
            return insertItem(result);
        })
    });


    // 新增条目菜单事件
    $('#form-add-trigger').on('click', function() {
        $('#form-add input').val('');
        $('#form-add textarea').val('');
        insertSelectClass();
        $('#detail-section > div').hide();
        $('#form-add').show(200);
    });


    // 新增笔记本事件
    $('#add-class-trigger').on('click', function(){
        var othis = $(this);
        var oContainer = $('#form-add-class');
        oContainer.removeClass('display-none');
        $('#submit-class').one('click', function() {
            var className = oContainer.children('input').val();
            // 过滤纯空格类名
            if(!className.replace(/\s+/g,"")) {
                return error('类名不能为空');
            } else if(checkSameClass(className)) {
                // 重新绑定一次事件
                othis.trigger('click');
                return error('换个名字吧，哥');
            } else {
                
                // 把现有的class储存到一个索引数组里
                if(localStorage.getItem('class')){
                    localStorage.setItem('class', localStorage.getItem('class') + ',' + className);
                } 
                else {
                    localStorage.setItem('class', className);
                }
                insertClass([className]);
                oContainer.addClass('display-none');
            }   
        });
    });
    
}

//Markdown Parser Function
function markedParser(string) {
    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false
    });
    var parsedContent = marked(string);

    return parsedContent;
}

/*************tab组件******************/
$.fn.extend({
    tab: function() {
        var othis = $(this);
        var eEontrol = $('.tab-control');
        //初始化
        console.log(othis);
        othis.children('.tab')
                .hide()
                .eq(0)
                .show();

        eEontrol.on('click', function(e){
            var index = $(e.target).data('index');

            eEontrol.removeClass('active');
            $(this).addClass('active');

            othis.children('.tab')
                .hide()
                .eq(index)
                .show();
        })
    }
})