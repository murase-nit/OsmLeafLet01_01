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

/*
 * 別ウインドウで地図を表示する
 */
Tab3Event.prototype.openWindow = function(){
	// クッキーに必要な値を書き込む.
	document.cookie = "centerLng=" + g_GlobalStaticNumber.centerLngLat.lng ;
	document.cookie = "centerLat=" + g_GlobalStaticNumber.centerLngLat.lat ;
	document.cookie = "upperLeftLng=" + g_GlobalStaticNumber.upperLeftLngLat.lng ;
	document.cookie = "upperLeftLat=" + g_GlobalStaticNumber.upperLeftLngLat.lat ;
	document.cookie = "lowerRightLng=" + g_GlobalStaticNumber.lowerRightLngLat.lng ;
	document.cookie = "lowerRightLat=" + g_GlobalStaticNumber.lowerRightLngLat.lat ;
	document.cookie = "windowX=" + g_GlobalStaticNumber.windowSize.x ;
	document.cookie = "windowY=" + g_GlobalStaticNumber.windowSize.y ;
	document.cookie = "scale=" + g_GlobalStaticNumber.scale;
	document.cookie = "category=" +g_tab2event.checkedCategoryLast;
	console.info(document.cookie);
	// hrefで指定されたURLが別窓で開く
	window.open('html/secondWindow.html','_blank', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, width=' + g_GlobalStaticNumber.windowSize.x + ', height=' + g_GlobalStaticNumber.windowSize.y);
};