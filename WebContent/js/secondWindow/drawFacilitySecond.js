/**
 * 施設データを描画する
 */
function DrawFacilitySecond(aGeoJsonFacility, upperLeftLngLat, lowerRightLngLat, aWindowSize){
	this.upperLeftLngLat = upperLeftLngLat;
	this.lowerRightLngLat = lowerRightLngLat;
	this.windowSize = aWindowSize;
	this.facilityJson = null;
	// xyのデータ(緯度経度でない).
	// [{x1: xxx ,y1: yyy},{}...].
	this.facilityPoint = new Array(0);
}

/**
 * 施設データの格納
 */
DrawFacilitySecond.prototype.drawFacility = function(){
	var convert = new ConvertLngLatXY(this.upperLeftLngLat, this.lowerRightLngLat, this.windowSize);
	// ajaxでjsonデータの受け取り.
	$.ajax({
		type: 'GET',
		url: "http://"+location.host+"/OsmLeafLet01_01/MainServlet?type=GetShopServlet&upperLeftLng="+
			this.upperLeftLngLat.lng+"&upperLeftLat="+this.upperLeftLngLat.lat+"&lowerRightLng="+
			this.lowerRightLngLat.lng+"&lowerRightLat="+this.lowerRightLngLat.lat+"&width="+
			this.windowSize.x+"&height="+this.windowSize.y+"&category="+
			g_secondWindowGlobal.category+"&isGetAllStroke=true",
		dataType: 'json',
		success: function(json){
			////////////////////////////////////////
			g_drawFacilitySecond.facilityJson = json;	// g_drawStrokeSecond.strokeJson 呼び出し元のインスタンス変数にすることはできないか.
			////////////////////////////////////////
				// データの格納.
				g_drawFacilitySecond.facilityPoint = new Array(0);
//				console.info(g_drawFacilitySecond.facilityJson);
				for(var s=0; s<g_drawFacilitySecond.facilityJson.features.length; s++){
					var xy = convert.convertLngLatToXY(
						{lng: g_drawFacilitySecond.facilityJson.features[s].geometry.coordinates[0]
					 , lat: g_drawFacilitySecond.facilityJson.features[s].geometry.coordinates[1]});
					g_drawFacilitySecond.facilityPoint.push({x: xy.x, y:xy.y});
				}
				// 描画.
				g_drawFacilitySecond.resizeFacility($(window).width(), $(window).height());
//				console.log(g_drawFacilitySecond.facilityPoint);
		}
	});
};

/*
 * 施設データの再描画
 */
DrawFacilitySecond.prototype.resizeFacility = function(aResizeX, aResizeY){
	if(g_drawFacilitySecond.facilityPoint.length<=0){return;}
	// 緯度経度xy.
	// canvasで描画.
	var canvas = document.getElementById('layer3');
	if ( ! canvas || ! canvas.getContext ) { return false; }
	var context = canvas.getContext('2d');
	/* Imageオブジェクトを生成 */
	var img = new Image();
//	img.src = "./../img/marker-icon.png";
	img.src = "http://"+location.host+"/OsmLeafLet01_01/img/marker-icon.png";
//console.log(img.src);
	// 再描画.
	for(var i=0; i<g_drawFacilitySecond.facilityPoint.length; i++){
//		console.info(g_drawSecondMap);
//		console.info(g_drawFacilitySecond.facilityPoint[i].x);
//		console.info(g_drawFacilitySecond.facilityPoint[i].y);
			context.drawImage(img, g_drawFacilitySecond.facilityPoint[i].x*g_drawSecondMap.xScale-15,
			 g_drawFacilitySecond.facilityPoint[i].y*g_drawSecondMap.yScale-41);
	}
};


