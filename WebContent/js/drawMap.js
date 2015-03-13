/*
 * 基本的な地図の描画
 *
 */
$(function(){
	"use strict";
	// 初期の地図位置スケールを指定
	var map = L.map('map_element');
	map.setView([35.157789, 136.93096], 16);

	// // OSMのタイルレイヤーを追加
	var tileLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	});
	tileLayer.addTo(map);

	// マーカーを表示.
	var mapMarker = L.marker([35.157789, 136.93096]);
	mapMarker.addTo(map);
	mapMarker.bindPopup('CSS3 popup. <br> ここはどこでしょうか？');
	mapMarker.openPopup();

	// 道路の表示.
//	var road = new L.GeoJSON.AJAX("http://localhost:8080/OsmLeafLet01_01/MainServlet?type=GetRoadDataServlet&upperLeftLng="+map.getBounds().getWest()+"&upperLeftLat="+map.getBounds().getNorth()+"&lowerRightLng="+map.getBounds().getEast()+"&lowerRightLat="+map.getBounds().getSouth()+"&width="+g_GlobalStaticNumber.windowSize.x+"&height="+g_GlobalStaticNumber.windowSize.y+"").addTo(map);

// ストロークの表示.
var road = new L.GeoJSON.AJAX("http://localhost:8080/OsmLeafLet01_01/MainServlet?type=GetFatStrokeServlet&upperLeftLng="+map.getBounds().getWest()+"&upperLeftLat="+map.getBounds().getNorth()+"&lowerRightLng="+map.getBounds().getEast()+"&lowerRightLat="+map.getBounds().getSouth()+"&width="+g_GlobalStaticNumber.windowSize.x+"&height="+g_GlobalStaticNumber.windowSize.y+"&category=Amenity:parking").addTo(map);

	// レイヤーの構成
	// ベースレイヤー(デフォルト表示).
	var baseLayers = {
	    "OpenStreetMap": tileLayer
	};
	// オーバーレイレイヤー(表示するかの選択可能).
	var overlays = {
	    "Marker": mapMarker,
	    "road": road,
	};
	L.control.layers(baseLayers, overlays).addTo(map);

	// add control scale
	L.control.scale().addTo(map);
});