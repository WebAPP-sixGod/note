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
			return success('添加成功'); 
		})
	})
})
function init(){
	var dsWidth = $(window).width() - $('#item-section').width() - $('#menu-section').width() - 29;
	//这个29是padding修正数，先这么处理
	$('#detail-section').css('width',dsWidth);
	showItem();
}