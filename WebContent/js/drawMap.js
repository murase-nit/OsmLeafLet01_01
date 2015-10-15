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
		attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	});
	tileLayer.addTo(map);
	// 自作のOSMタイルサーバを使う.
	var tile2Layer = L.tileLayer('http://tsgMapServer.elcom.nitech.ac.jp/osm/{z}/{x}/{y}.png', {
		attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	});
	tile2Layer.addTo(map);

	// 描画のスタイル設定.
	var strokeStyle = {
	    "color": "#000000",
	    "weight": 5,
	    "opacity": 0.8
	};
	var shopStyle = {
		"color": "#ff0000",
		"weight": 5,
		"opacity": 0.8
	};

	// ストロークの表示.
	var newStroke;	// 描画するストローク.
	var previousStroke;	// 前回のデータを保持する.;
	newStroke = new L.GeoJSON.AJAX(drawStrokeUrl() ,{style:strokeStyle});
		 newStroke.addTo(map);
//	drawStroke();

	// 施設データの表示.
	var newShop = null;	// 描画する施設データ.
	var previousShop;	// 前回の施設データ.
	newShop = new L.GeoJSON.AJAX(drawShopUrl() ,{style:strokeStyle});
		newShop.addTo(map);
	//drawShop();

	// レイヤーの構成
	// ベースレイヤー(デフォルト表示).
	var baseLayers = {
			"localOSM":tile2Layer,
			"OpenStreetMap": tileLayer
	};
	// オーバーレイレイヤー(表示するかの選択可能).
	var overlays = {
//	    "road": road,
				"stroke": newStroke//,
//				"shop": newShop
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
	map.on('moveend', drawShop);
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
		previousStroke = newStroke;
		map.removeLayer(previousStroke);
		// コンソールにurlを表示.
		console.log(drawStrokeUrl());
		// 再描画.
		newStroke = new L.GeoJSON.AJAX(drawStrokeUrl() ,{style:strokeStyle});
		 newStroke.addTo(map);
	}
	/*
	 * 道路を取得するためのURL
	 */
	function drawStrokeUrl(){
		return "http://"+location.host+"/OsmLeafLet01_01/MainServlet?" +
					"type=GetFatStrokeServlet&upperLeftLng="+map.getBounds().getWest()+"" +
					"&upperLeftLat="+map.getBounds().getNorth()+"" +
					"&lowerRightLng="+map.getBounds().getEast()+"" +
					"&lowerRightLat="+map.getBounds().getSouth()+"" +
					"&width="+g_GlobalStaticNumber.windowSize.x+"" +
					"&height="+g_GlobalStaticNumber.windowSize.y+"" +
					"&category="+g_tab2event.checkedCategoryLast;
	}

	/*
	 * 施設データの表示
	 */
	function drawShop(){
		console.log('drawShop');
		previousShop = newShop;
		map.removeLayer(previousShop);
		newShop = new L.GeoJSON.AJAX(drawShopUrl() ,{style:strokeStyle});
		newShop.addTo(map);
	}
	/*
	 * 施設データの取得するためのURL
	 */
	function drawShopUrl(){
		return "http://"+location.host+"/OsmLeafLet01_01/MainServlet?type=GetShopServlet&upperLeftLng="+map.getBounds().getWest()+"&upperLeftLat="+map.getBounds().getNorth()+"&lowerRightLng="+map.getBounds().getEast()+"&lowerRightLat="+map.getBounds().getSouth()+"&width="+g_GlobalStaticNumber.windowSize.x+"&height="+g_GlobalStaticNumber.windowSize.y+"&category="+g_tab2event.checkedCategoryLast;
	}

});