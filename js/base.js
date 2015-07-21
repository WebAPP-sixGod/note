$(document).ready(function(){
	init();
	$('#submit-add').on('click', function(){
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
			var itemEntry = $('.item');
			//更新条目
			itemEntry.empty();
			showItem();
			return success('添加成功'); 
		});
	});

	$('.itemEdit').on('click', function() {
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
			console.log(clicked)
			var changedItem = clicked.prevAll();
			var changedItemTitle = changedItem.find('input').val();
			var changedItemAbstract = changedItem.find('textarea').val();
			if (changedItemTitle != itemTitle) {
				//有个问题是这里当更新完之后，不能及时更新好条目
				localStorage.removeItem(itemTitle);
				currentItem.title = changedItemTitle;
				currentItem.abstract = changedItemAbstract;
				localStorage.setItem('index', localStorage.getItem('index').replace(itemTitle, changedItemTitle));
				localStorage.setItem(changedItemTitle, JSON.stringify(currentItem));
				showItem();
			} else {
				currentItem.abstract = changedItemAbstract;
				console.log(currentItem);
				localStorage.setItem(itemTitle, JSON.stringify(currentItem));
				showItem();
			}
		});
	});
})
function init(){
	var dsWidth = $(window).width() - $('#item-section').width() - $('#menu-section').width() - 29;
	//这个29是padding修正数，先这么处理
	$('#detail-section').css('width',dsWidth);
	$('#submit-add').prop('disabled', false);
	$('#update-add').prop('disabled', true);
	showItem();
}