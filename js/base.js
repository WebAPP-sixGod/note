$(document).ready(function(){
	init();
})
function init(){
	var dsWidth = $(window).width() - $('#item-section').width() - $('#menu-section').width() - 29;
	//这个29是padding修正数，先这么处理
	$('#detail-section').css('width',dsWidth);
	$('#submit-add').prop('disabled', false);
	$('#update-add').prop('disabled', true);
	// 初始化item列表
	showItem();
    init_event();
}

