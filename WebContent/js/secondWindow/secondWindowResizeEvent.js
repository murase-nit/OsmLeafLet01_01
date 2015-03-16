/**
 * リサイズイベント
 */

var g_secondWindowResizeEvent;

$(function(){
	g_secondWindowResizeEvent = new SecondWindowResizeEvent();
});

$(window).resize(function() {

	SecondWindowResizeEvent.prototype.resizeWindow();
	//console.log($(window).width());
});

function SecondWindowResizeEvent(){
}

// ウインドウサイズに応じてレイアウトを動的に変更
SecondWindowResizeEvent.prototype.resizeWindow = function (){
	console.log("resize event");
	g_drawSecondMap.resizeMapDraw($(window).width(), $(window).height());
};