// Whole-script strict mode syntax
"use strict";

// グローバススタティック変数を定義する.


var g_GlobalStaticNumber = new GlobalStaticNumber();


function GlobalStaticNumber(){
		// プロジェクト名.
		this.projectName = "OsmLeafLet01_01";
		// ホストのIPアドレス.
		this.hostName =  "133.68.13.112:8080";
		// ウインドウサイズ.
		this.windowSize = {x:100, y:100};
		// 中心の緯度経度.
		this.centerLngLat = {lng:136.93096, lat:35.157789};
}





