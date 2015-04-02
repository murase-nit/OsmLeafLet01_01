/*
 * 基本的な地図の描画
 *
 */
$(function(){
	// 初期の地図位置スケールを指定
	var map = L.map('map_element');
	map.setView([35.157789, 136.93096], 16);

	// // OSMのタイルレイヤーを追加
	var tileLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//	var tileLayer = L.tileLayer('http://tsgMapServer.elcom.nitech.ac.jp/osm/{z}/{x}/{y}.png', {
		attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	});
	tileLayer.addTo(map);
	var tile2Layer = L.tileLayer('http://tsgMapServer.elcom.nitech.ac.jp/osm/{z}/{x}/{y}.png', {
		attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	});
	tile2Layer.addTo(map);

	// マーカーを表示.
	// var mapMarker = L.marker([35.157789, 136.93096]);
	// mapMarker.addTo(map);
	// mapMarker.bindPopup('CSS3 popup. <br> ここはどこでしょうか？');
	// mapMarker.openPopup();

	// 描画のスタイル設定.
	var myStyle = {
	    "color": "#000000",
	    "weight": 5,
	    "opacity": 0.8
	};

	// ストロークの表示.
	var newStroke = new L.GeoJSON.AJAX("http://"+location.host+"/OsmLeafLet01_01/MainServlet?type=GetFatStrokeServlet&upperLeftLng="+map.getBounds().getWest()+"&upperLeftLat="+map.getBounds().getNorth()+"&lowerRightLng="+map.getBounds().getEast()+"&lowerRightLat="+map.getBounds().getSouth()+"&width="+g_GlobalStaticNumber.windowSize.x+"&height="+g_GlobalStaticNumber.windowSize.y+"&category="+g_tab2event.checkedCategoryLast,{style:myStyle});
	var previousStroke;
	newStroke.addTo(map);

//L.geoJson(geojsonFeature).addTo(map);


	// レイヤーの構成
	// ベースレイヤー(デフォルト表示).
	var baseLayers = {
			"localOSM":tile2Layer,
			"OpenStreetMap": tileLayer
	};
	// オーバーレイレイヤー(表示するかの選択可能).
	var overlays = {
//	    "Marker": mapMarker,
//	    "road": road,
				"stroke": newStroke
	};
	L.control.layers(baseLayers, overlays).addTo(map);

	// add control scale
	L.control.scale().addTo(map);

	// 各種パラメータの取得.
	getParams();

	///////////////////////////
	// イベント関係///////////////
	///////////////////////////
	/*
	 * 移動が完了したときの処理
	 */
	map.on('moveend', getParams);
	map.on('moveend', drawStroke);
	/*
	 * 各種パラメータの取得
	 */
	function getParams(){
		g_GlobalStaticNumber.centerLngLat = {lng: map.getCenter().lng, lat: map.getCenter().lat};
		g_GlobalStaticNumber.upperLeftLngLat = {lng: map.getBounds().getWest(), lat: map.getBounds().getNorth()};
		g_GlobalStaticNumber.lowerRightLngLat = {lng: map.getBounds().getEast(), lat: map.getBounds().getSouth()};
		g_GlobalStaticNumber.scale = map.getZoom();
		//console.info(map.getSize());
	}

	/*
	* 道路の再描画
	*/
	function drawStroke(){
		console.log('drawStroke');
		// 以前に描画した道路は削除.
		previousStroke = newStroke;
		map.removeLayer(previousStroke);
		// コンソールにurlを表示.
		console.log("http://"+location.host+"/OsmLeafLet01_01/MainServlet?type=GetFatStrokeServlet&upperLeftLng="+map.getBounds().getWest()+"&upperLeftLat="+map.getBounds().getNorth()+"&lowerRightLng="+map.getBounds().getEast()+"&lowerRightLat="+map.getBounds().getSouth()+"&width="+g_GlobalStaticNumber.windowSize.x+"&height="+g_GlobalStaticNumber.windowSize.y+"&category="+g_tab2event.checkedCategoryLast);
		// 再描画.
		newStroke = new L.GeoJSON.AJAX("http://"+location.host+"/OsmLeafLet01_01/MainServlet?type=GetFatStrokeServlet&upperLeftLng="+map.getBounds().getWest()+"&upperLeftLat="+map.getBounds().getNorth()+"&lowerRightLng="+map.getBounds().getEast()+"&lowerRightLat="+map.getBounds().getSouth()+"&width="+g_GlobalStaticNumber.windowSize.x+"&height="+g_GlobalStaticNumber.windowSize.y+"&category="+g_tab2event.checkedCategoryLast ,{style:myStyle});
		 newStroke.addTo(map);
	}


});