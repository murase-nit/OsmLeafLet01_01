/**
 * リサイズイベント
 */
function SecondWindowResizeEvent(){
}

/*
 * ウインドウサイズに応じてレイアウトを動的に変更
 */
SecondWindowResizeEvent.prototype.resizeWindow = function (){
	console.log("resize event");
	g_drawSecondMap.resizeMapDraw($(window).width(), $(window).height());
};

/*
 * ウインドウサイズに応じて道路の表示を変更
 */
SecondWindowResizeEvent.prototype.resizeStroke = function (){
	g_drawStrokeSecond.resizeStroke($(window).width(), $(window).height());
};

/**
 * ウインドウのサイズに応じて施設データの表示を変更
 */
SecondWindowResizeEvent.prototype.resizeFacility = function(){
	g_drawFacilitySecond.resizeFacility($(window).width(), $(window).height());
};
