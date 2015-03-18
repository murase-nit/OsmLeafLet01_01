/*
 * secondWindowに関するメインのファイル
 */
var g_drawSecondMap;
var g_drawStrokeSecond;
var g_secondWindowResizeEvent;

var g_secondWindowGlobal = new SecondWindowGlobal();

function SecondWindowGlobal(){
		// ウインドウサイズ.
		this.windowSize = {x: 0, y: 0};
		// 中心の緯度経度.
		this.centerLngLat = {lng:0.0, lat:0.0};
		// 左上の緯度経度.
		this.upperLeftLngLat = {lng: 0, lat: 0};
		// 右下の緯度経度.
		this.lowerRightLngLat = {lng: 0, lat: 0};
		// 地図のスケール.
		this.scale = 0;
}

$(function(){
	// 発行したクッキーの取得（読み込み）
	if (document.cookie) {
		var cookies = document.cookie.split("; ");
	//	console.log(cookies);
		for (var i = 0; i < cookies.length; i++) {
			var str = cookies[i].split("=");
			switch(str[0]){
				case "centerLng":
					g_secondWindowGlobal.centerLngLat.lng = Number(str[1]) + 0;
				break;
				case "centerLat":
					g_secondWindowGlobal.centerLngLat.lat = Number(str[1])  + 0;
				break;
				case "upperLeftLng":
					g_secondWindowGlobal.upperLeftLngLat.lng = Number(str[1]) + 0;
				break;
				case "upperLeftLat":
					g_secondWindowGlobal.upperLeftLngLat.lat = Number(str[1]) + 0;
				break;
				case "lowerRightLng":
					g_secondWindowGlobal.lowerRightLngLat.lng = Number(str[1]) + 0;
				break;
				case "lowerRightLat":
					g_secondWindowGlobal.lowerRightLngLat.lat = Number(str[1]) + 0;
				break;
				case "windowX":
					g_secondWindowGlobal.windowSize.x = Number(str[1]) + 0;
				break;
				case "windowY":
					g_secondWindowGlobal.windowSize.y = Number(str[1]) + 0;
				break;
				case "scale":
					g_secondWindowGlobal.scale = Number(str[1]) + 0;
				break;
			}
		}
	}
console.info(g_secondWindowGlobal);
	g_drawSecondMap = new DrawSecondMap(
		g_secondWindowGlobal.centerLngLat,
		g_secondWindowGlobal.scale,
		g_secondWindowGlobal.windowSize);
	g_drawSecondMap.mapDraw();

	g_drawStrokeSecond = new DrawStrokeSecond(
		null,
		g_secondWindowGlobal.upperLeftLngLat,
		g_secondWindowGlobal.lowerRightLngLat,
		g_secondWindowGlobal.windowSize);
	g_drawStrokeSecond.drawStroke();

	g_secondWindowResizeEvent = new SecondWindowResizeEvent();



});




/**
 * ウインドウリサイズ時にのイベント
 */
$(window).resize(function() {

	g_secondWindowResizeEvent.resizeWindow();
	g_secondWindowResizeEvent.resizeStroke();
	//console.log($(window).width());
});

