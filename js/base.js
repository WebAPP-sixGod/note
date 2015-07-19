$(document).ready(function(){
	var dsWidth = $(window).width() - $('#item-section').width() - $('#menu-section').width() - 29;
	//这个29是padding修正数，先这么处理
	$('#detail-section').css('width',dsWidth);
})