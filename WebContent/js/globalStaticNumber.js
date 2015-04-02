// Whole-script strict mode syntax
"use strict";

// グローバススタティック変数を定義する.


var g_GlobalStaticNumber = new GlobalStaticNumber();


function GlobalStaticNumber(){
		// プロジェクト名.
		this.projectName = "OsmLeafLet01_01";
		// ホストのIPアドレス.
		this.hostName =  location.host;
		// ウインドウサイズ.
		this.windowSize = {x:100, y:100};
		// 中心の緯度経度.
		this.centerLngLat = {lng:136.93096, lat:35.157789};
		// 左上の緯度経度.
		this.upperLeftLngLat = {lng: 0, lat: 0};
		// 右下の緯度経度.
		this.lowerRightLngLat = {lng: 0, lat: 0};
		// 地図のスケール.
		this.scale = 0;
}





