/**
 * 地図の大きさによってストロークを描画する
 */
function DrawStrokeSecond(aGeoJsonStroke, upperLeftLngLat, lowerRightLngLat, aWindowSize){
//	this._getJsonStroke = aGeoJsonStroke;
	this.upperLeftLngLat = upperLeftLngLat;
	this.lowerRightLngLat = lowerRightLngLat;
	this.windowSize = aWindowSize;
	this.strokeJson = null;
}

/**
 * ストロークの描画
 */
DrawStrokeSecond.prototype.drawStroke = function(){
	var convert = new ConvertLngLatXY(this.upperLeftLngLat, this.lowerRightLngLat, this.windowSize);
	// ajaxでjsonデータの受け取り.
	$.ajax({
	  type: 'GET',
	  url: "http://localhost:8080/OsmLeafLet01_01/MainServlet?type=GetFatStrokeServlet&upperLeftLng="+this.upperLeftLngLat.lng+"&upperLeftLat="+this.upperLeftLngLat.lat+"&lowerRightLng="+this.lowerRightLngLat.lng+"&lowerRightLat="+this.lowerRightLngLat.lat+"&width="+this.windowSize.x+"&height="+this.windowSize.y+"&category=Amenity:parking",
		dataType: 'json',
		success: function(json){
			////////////////////////////////////////
			g_drawStrokeSecond.strokeJson = json;	// g_drawStrokeSecond.strokeJson 呼び出し元のインスタンス変数にすることはできないか.
			////////////////////////////////////////

				// canvasで描画.
				var canvas = document.getElementById('layer1');
				if ( ! canvas || ! canvas.getContext ) { return false; }
			  var context = canvas.getContext('2d');
				//色を指定する
				context.strokeStyle = 'rgb(00,00,00)'; //枠線の色は黒
				context.lineWidth = 4;// 線の太さ.
				// 描画.
				for(var s=0; s<g_drawStrokeSecond.strokeJson.features.length; s++){
					for(var i=0; i<g_drawStrokeSecond.strokeJson.features[s].geometry.coordinates.length - 1; i++){
						context.beginPath();//現在のパスをリセットします。
						var xy1 = convert.convertLngLatToXY({lng: g_drawStrokeSecond.strokeJson.features[s].geometry.coordinates[i][0], lat: g_drawStrokeSecond.strokeJson.features[s].geometry.coordinates[i][1]});
						var xy2 = convert.convertLngLatToXY({lng: g_drawStrokeSecond.strokeJson.features[s].geometry.coordinates[i+1][0], lat: g_drawStrokeSecond.strokeJson.features[s].geometry.coordinates[i+1][1]});
						context.moveTo(xy1.x, xy1.y);
						context.lineTo(xy2.x, xy2.y);
						context.stroke();
					}
				}
				console.log("finish draw stroke");

		}
	});
console.log("draw stroke not yet ajax");
};

/*
 * ストロークの再描画
 */
DrawStrokeSecond.prototype.resizeStroke = function(aResizeX, aResizeY){
	var convert = new ConvertLngLatXY(this.upperLeftLngLat, this.lowerRightLngLat, {x:aResizeX,y:aResizeY});
	// canvasで描画.
	var canvas = document.getElementById('layer1');
	if ( ! canvas || ! canvas.getContext ) { return false; }
  var context = canvas.getContext('2d');
	//色を指定する
	context.strokeStyle = 'rgb(00,00,00)'; //枠線の色は黒
	context.lineWidth = 4;// 線の太さ.
	// 再描画.
	for(var s=0; s<g_drawStrokeSecond.strokeJson.features.length; s++){
		for(var i=0; i<g_drawStrokeSecond.strokeJson.features[s].geometry.coordinates.length - 1; i++){
			context.beginPath();//現在のパスをリセットします。
			var xy1 = convert.convertLngLatToXY({lng: g_drawStrokeSecond.strokeJson.features[s].geometry.coordinates[i][0], lat: g_drawStrokeSecond.strokeJson.features[s].geometry.coordinates[i][1]});
			var xy2 = convert.convertLngLatToXY({lng: g_drawStrokeSecond.strokeJson.features[s].geometry.coordinates[i+1][0], lat: g_drawStrokeSecond.strokeJson.features[s].geometry.coordinates[i+1][1]});
			context.moveTo(xy1.x, xy1.y);
			context.lineTo(xy2.x, xy2.y);
			context.stroke();
		}
	}

};


