$(document).ready(function(){
	init();
    $('.tab-container').tab();
})
function init(){
	showAllItem();
    $('#detail-section > div').hide();
    init_event();
}