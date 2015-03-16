/** 地図描画する */
var g_drawSecondMap;

$(function(){
	g_drawSecondMap = new DrawSecondMap({lng:136.93096,lat:35.157789}, 16, {x:600, y:600});
	g_drawSecondMap.mapDraw();
});

function DrawSecondMap(aLngLat, scale, aWindowSize){
	// 地図画像描画で必要な値.
	this._lngLat = aLngLat;
	this._windowSize = aWindowSize;
	this._scale = scale;
	this._upperLeftLngLat = {x:null, y:null};
	this._lowerRightLngLat = {x:null, y:null};
}

/**
 *地図の描画 (引数：中心のxy座標)
 */
DrawSecondMap.prototype.mapDraw = function(){
	// 地図画像描画用のcancasタグ大きさ設定.
	$("#secondPanel canvas").attr({
		width:g_GlobalStaticNumber.windowSize.x,
		height:g_GlobalStaticNumber.windowSize.y
	});
	
	var canvas = document.getElementById('layer0');
	if ( ! canvas || ! canvas.getContext ) { return false; }
  g_drawSecondMap.ctx = canvas.getContext('2d');
//  g_drawSecondMap.ctx.beginPath();
  g_drawSecondMap.img = new Image();
  g_drawSecondMap.img.src = "http://rain.elcom.nitech.ac.jp/OsmStaticMap/staticmap.php?"+
		"center="+g_drawSecondMap._lngLat.lat+","+g_drawSecondMap._lngLat.lng+"&"+
		"zoom="+g_drawSecondMap._scale+"&"+
		"size="+g_drawSecondMap._windowSize.x+"x"+g_drawSecondMap._windowSize.y+"&maptype=mapnik";
	g_drawSecondMap.ctx.scale(1.0,1.0);
	g_drawSecondMap.mapImage = g_drawSecondMap.img;
	g_drawSecondMap.img.onload = function() {
		//refer to http://www.html5.jp/canvas/how6.html
		g_drawSecondMap.ctx.drawImage(g_drawSecondMap.img, 0, 0, g_drawSecondMap._windowSize.x,g_drawSecondMap._windowSize.y);
	};
	console.log('complete map draw');
};

/**
 *  リサイズしたときの地図の変形
 */
DrawSecondMap.prototype.resizeMapDraw = function(aResizeX, aResizeY){
		// 地図画像描画用のcancasタグ大きさ設定.
	 $("#secondPanel canvas").attr({
	 	width:aResizeX,
	 	height:aResizeY
	 });
	
	var canvas = document.getElementById('layer0');
	if ( ! canvas || ! canvas.getContext ) { return false; }
  g_drawSecondMap.ctx = canvas.getContext('2d');
  g_drawSecondMap.img = g_drawSecondMap.mapImage;
	//g_drawSecondMap.ctx.scale(aResizeX/g_drawSecondMap._windowSize.x, aResizeY/g_drawSecondMap._windowSize.y);
	g_drawSecondMap.ctx.drawImage(g_drawSecondMap.mapImage, 0, 0, aResizeX, aResizeY);
	console.log('complete resize map draw');

};
