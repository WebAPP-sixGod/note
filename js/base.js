$(document).ready(function(){
	init();
})
function init(){
	var dsWidth = $(window).width() - $('#item-section').width() - $('#menu-section').width() - 85;
	//这个29是padding修正数，先这么处理
	// $('#detail-section').css('width',dsWidth);
	// 初始化item列表
	showItem();
    $('#detail-section > div').hide();
    init_event();
}

