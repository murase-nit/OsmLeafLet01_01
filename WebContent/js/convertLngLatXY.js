/**
 * 緯度経度とアプレット座標の変換に関するクラス
 * @author murase
 *
 */
function ConvertLngLatXY(aUpperLeftLngLat, aLowerRightLngLat, aWindowSize){
	/** 左上の経度, 左上の緯度. */
	this.upperLeftLngLat = aUpperLeftLngLat;
	/** 右下の経度, 右下の緯度. */
	this.lowerRightLngLat = aLowerRightLngLat;
	/** ウインドウサイズ */
	this.windowSize = aWindowSize;
}

/**
 * 緯度経度からアプレット内座標に変換.
 * @param aLngLat 緯度経度
 * @return　アプレット座標
 */
ConvertLngLatXY.prototype.convertLngLatToXY = function(aLngLat){
		var width = this.lowerRightLngLat.lng - this.upperLeftLngLat.lng;	// 右端から左端までの経度の差（経度であらわされている）.
		var hight = this.upperLeftLngLat.lat - this.lowerRightLngLat.lat ;	// 上端から下端までの緯度の差（緯度であらわされている）.
		var widthBase = this.windowSize.x/width;				// widthBaseの逆数がアプレット1ドットあたりの経度の増加幅.
		var heightBase = this.windowSize.y/hight;			// heightBaseの逆数がアプレット1ドットあたりの緯度の増加幅.
		var xtoi = (aLngLat.lng - this.upperLeftLngLat.lng)*widthBase;	// アプレット内のｘ座標.
		var ytoi = (aLngLat.lat - this.lowerRightLngLat.lat)*heightBase;	// アプレット内のy座標.
		return({x:xtoi, y:this.windowSize.y - ytoi});	// 戻り値のY軸は反転させる必要がある.
};

/**
 * アプレット内座標から緯度経度に変換
 * @param aAppletCoordinate　アプレット内座標
 * @return 緯度経度
 */
ConvertLngLatXY.prototype.convertXYToLngLat = function(XY){
		var appletCoordinateX = XY.x;
		var appletCoordinateY = this.windowSize.y - XY.y;	// Y軸の反転.
		var width = this.lowerRightLngLat.lng - this.upperLeftLngLat.lng;	// 右端から左端までの経度の差（経度であらわされている）.
		var hight = this.upperLeftLngLat.lat - this.lowerRightLngLat.lat ;	// 上端から下端までの緯度の差（緯度であらわされている）.
		var widthBase = this.windowSize.x/width;			// widthBaseの逆数がアプレット1ドットあたりの経度の増加幅.
		var heightBase = this.windowSize.y/hight;		// heightBaseの逆数がアプレット1ドットあたりの緯度の増加幅.
		
		return({lng: (appletCoordinateX/widthBase)+this.upperLeftLngLat.x, 
			lat:(appletCoordinateY/heightBase)+this.lowerRightLngLat.y});

};
