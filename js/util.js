var itemsDiv = $('.items');//笔记条目容器


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
    if(localStorage.getItem('class')) {
        $('#item-class').empty();
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
        tpl = '<div class="item"><p class="item-title">'+ o.title +'</p>'+ '<p class="item-abstract">'+ o.markedAbstract +'</p><button class="itemEdit">编辑</button><button class="itemDelete">删除</button><span class="item-time">' + o.cTime + '</span></div>';
        
        itemEntry.append(tpl);
    });
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
                'class': '',
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
        console.log(e.target);
        e.stopPropagation();
        var othis = $(e.target);
		var clicked = $(this);
		var currenDiv = clicked.prevAll();
        console.log(currenDiv);
		var itemTitle = currenDiv[3].innerHTML;
		//var itemAbstract = currenDiv[2].innerHTML;
		var currentItem = JSON.parse(localStorage.getItem(itemTitle));
        var itemAbstract = currentItem.abstract;
       
        console.log(currentItem);

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
            //Markdown解析，将markdown语句解析成html语句
            var parseResult = markedParser(changedItemAbstract);
            console.log('parseResult');
			var o = JSON.parse(localStorage.getItem(itemTitle));
			o.title = changedItemTitle;
			o.abstract = parseResult;
			var item = new Item(o);
			if (changedItemTitle != itemTitle) {
				// 检查修改后的title是否会重复
                if(!localStorage.getItem(changedItemTitle)) {
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


    // 按类别筛选
    $(document).on('click', '#item-class li', function(e) {
        var thisClass = $(e.target).data('class');
        Item.getByClass(thisClass, function(err, result) {
            itemsDiv.empty();
            return insertItem(result);
        })
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
                return error('类名不能为空');
            } else {
                
                // 把现有的class储存到一个索引数组里
                if(localStorage.getItem('class')){
                    localStorage.setItem('class', localStorage.getItem('class') + ',' + className);
                } 
                else {
                    localStorage.setItem('class', className);
                }
                insertClass([className]);
            }
        });

    });
}


function disDetail(o) {
    $('#detail-section > div').hide();
    $('#item-detail-title h1').text(o.title);
    //$('#item-detail-abstract div').text(o.abstract);
    //因为marked解析的到的是html语句，所以可以直接append上去。
    $('#item-detail-abstract #abstract-container').append(o.markedAbstract);
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
            + ')</li>';
        oContainer.append(li);
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
    console.log(parsedContent);

    return parsedContent;
}