/**
 * 地図の大きさによってストロークを描画する
 */
function DrawStrokeSecond(aGeoJsonStroke, upperLeftLngLat, lowerRightLngLat, aWindowSize){
//	this._getJsonStroke = aGeoJsonStroke;
	this.upperLeftLngLat = upperLeftLngLat;
	this.lowerRightLngLat = lowerRightLngLat;
	this.windowSize = aWindowSize;
	this.strokeJson = null;
	// xyのデータ(緯度経度でない).
	// [nnn][{x1: xxx ,y1: yyy, x2: xxx, y2: yyy},{}...].
	this.strokeArc = new Array(0);
	// 道路占有率 = 選択された道路長*太さ / 画像の大きさ.に対する閾値
	this.ROAD_RATE = 0.15;
}

/**
 * ストロークの格納
 */
DrawStrokeSecond.prototype.drawStroke = function(){
	var convert = new ConvertLngLatXY(this.upperLeftLngLat, this.lowerRightLngLat, this.windowSize);
	// ajaxでjsonデータの受け取り.
	$.ajax({
	  type: 'GET',
	  url: "http://localhost:8080/OsmLeafLet01_01/MainServlet?type=GetFatStrokeServlet&upperLeftLng="+this.upperLeftLngLat.lng+"&upperLeftLat="+this.upperLeftLngLat.lat+"&lowerRightLng="+this.lowerRightLngLat.lng+"&lowerRightLat="+this.lowerRightLngLat.lat+"&width="+this.windowSize.x+"&height="+this.windowSize.y+"&category=Amenity:parking&isGetAllStroke=true",
		dataType: 'json',
		success: function(json){
			////////////////////////////////////////
			g_drawStrokeSecond.strokeJson = json;	// g_drawStrokeSecond.strokeJson 呼び出し元のインスタンス変数にすることはできないか.
			////////////////////////////////////////
				// データの格納.
				g_drawStrokeSecond.strokeArc = new Array(0);
				for(var s=0; s<g_drawStrokeSecond.strokeJson.features.length; s++){
					var tempOneStroke = new Array(0);	// ストローク1つ分のデータ.
					for(var i=0; i<g_drawStrokeSecond.strokeJson.features[s].geometry.coordinates.length - 1; i++){
						var xy1 = convert.convertLngLatToXY({lng: g_drawStrokeSecond.strokeJson.features[s].geometry.coordinates[i][0], lat: g_drawStrokeSecond.strokeJson.features[s].geometry.coordinates[i][1]});
						var xy2 = convert.convertLngLatToXY({lng: g_drawStrokeSecond.strokeJson.features[s].geometry.coordinates[i+1][0], lat: g_drawStrokeSecond.strokeJson.features[s].geometry.coordinates[i+1][1]});
						tempOneStroke.push({x1: xy1.x ,y1: xy1.y, x2: xy2.x, y2: xy2.y});
					}
					g_drawStrokeSecond.strokeArc.push(tempOneStroke);
				}
				// 描画.
				g_drawStrokeSecond.resizeStroke($(window).width(), $(window).height());
		}
	});
};

/*
 * ストロークの再描画
 */
DrawStrokeSecond.prototype.resizeStroke = function(aResizeX, aResizeY){
	if(g_drawStrokeSecond.strokeArc.length<=0){return;}
	// 描画する数を決める.
	var drawStrokeNum = g_drawStrokeSecond.execSoaThreshold(g_drawStrokeSecond.strokeArc.length, this.ROAD_RATE, aResizeX, aResizeY);
	console.log("draw stroke num : "+drawStrokeNum);
	// 緯度経度xy.
	// canvasで描画.
	var canvas = document.getElementById('layer1');
	if ( ! canvas || ! canvas.getContext ) { return false; }
  var context = canvas.getContext('2d');
	//色を指定する
	context.strokeStyle = 'rgb(00,00,00)'; //枠線の色は黒
	context.lineWidth = 4;// 線の太さ.
	// 再描画.
	for(var i=0; i<drawStrokeNum; i++){
		for(var j=0; j<g_drawStrokeSecond.strokeArc[i].length; j++){
			context.beginPath();//現在のパスをリセットします。
			var xy1 = {x: g_drawStrokeSecond.strokeArc[i][j].x1, y: g_drawStrokeSecond.strokeArc[i][j].y1};
			var xy2 = {x: g_drawStrokeSecond.strokeArc[i][j].x2, y: g_drawStrokeSecond.strokeArc[i][j].y2};
			context.moveTo(xy1.x*g_drawSecondMap.xScale, xy1.y*g_drawSecondMap.yScale);
			context.lineTo(xy2.x*g_drawSecondMap.xScale, xy2.y*g_drawSecondMap.yScale);
			context.stroke();
		}
	}
};


/**
 * 地図サイズによっていくつのストロークを描画するかの閾値を決定.
 */
DrawStrokeSecond.prototype.execSoaThreshold = function(aAllStrokeNum, ROAD_RATE, aResizeX, aResizeY){
	var convert = new ConvertLngLatXY(this.upperLeftLngLat, this.lowerRightLngLat, this.windowSize);
	var soaThreshold = 0;	// 何個のストロークを表示するか.
	while(true){
		var allLinkLengthAppletCoordinate = 0;// アプレット内の表示されているリンクの長さ.
		for(var i=0; i<soaThreshold && i < aAllStrokeNum; i++){	// アプレット内の表示されているリンクの長さを計算する.
			for(var j=0; j<g_drawStrokeSecond.strokeArc[i].length; j++){
				//完全版未完成?(描画されている道路のアップレット内の長さの合計を取得する).
				// 1つのストロークのアプレット内のジオメトリ.
				var oneArcXyStart = {x: g_drawStrokeSecond.strokeArc[i][j].x1, y: g_drawStrokeSecond.strokeArc[i][j].y1};
				var oneArcXyEnd = {x: g_drawStrokeSecond.strokeArc[i][j].x2, y: g_drawStrokeSecond.strokeArc[i][j].y2};
				allLinkLengthAppletCoordinate += DrawStrokeSecond.distance(oneArcXyStart, oneArcXyEnd);
			}
		}
		// 道路占有率 = 選択された道路長*太さ / 画像の大きさ.
		var roadRate = (allLinkLengthAppletCoordinate*5)/(aResizeX*aResizeY);
		if(roadRate > ROAD_RATE || soaThreshold >  aAllStrokeNum){
			break;
		}else{
			soaThreshold++;
		}
	}
	return soaThreshold;
};
DrawStrokeSecond.distance = function(p1,p2) {
	var a, b, d;
	a = p1.x - p2.x;
	b = p1.y - p2.y;
	d = Math.sqrt(Math.pow(a,2) + Math.pow(b,2));
	return d;
};
