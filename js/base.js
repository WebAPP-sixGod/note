$(document).ready(function(){
	init();
    $('.tab-container').tab();
    $('.paint-container').each(function() {
        $(this).paintBoard();
    })
})
function init(){
	showAllItem();
    $('#detail-section > div').hide();
    init_event();
}