/*
 * 左メニュの3つ目のウインドウ
 */
var g_tab3event = new Tab3Event();

function Tab3Event(){

}

$(function(){

});

g_tab3event.init= function(){
	// 別ウインドウで地図表示
  $("#generalization").bind("click",g_tab3event.openWindow);
};

/**
 * .
 */
//Tab1Event.prototype.xxx = function(){
//};

Tab3Event.prototype.openWindow = function(){
	// hrefで指定されたURLが別窓で開く
	window.open('html/secondWindow.html','_blank', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, width=' + 600 + ', height=' + 600);
};