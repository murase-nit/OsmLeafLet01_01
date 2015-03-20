package servlet.src;

import java.awt.Point;
import java.awt.geom.Line2D;
import java.awt.geom.Point2D;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mySrc.QuickSort2;
import mySrc.coordinate.ConvertLngLatAppletCoordinate;
import mySrc.db.getData.OsmDataGeom;
import mySrc.db.getData.OsmFatStroke;
import mySrc.db.getData.OsmStrokeDataGeom;
import mySrc.parseGeoJson.others.CreateGeoJson;

/**
 * 必要なパラメータを受け取り、fatstrokeを表示する
 * @author murase
 *
 */
public class GetFatStrokeServlet {
	
	/** 施設データの重み */
	public static final double FACILITY_PARAM = 0.3;
	/** 道路データの重み */
	public static final double LENGTH_PARAM = 1- FACILITY_PARAM;
	/** 道路の描画する数に関する閾値(地図全体の何％道路で埋めるか) */
	public static final double ROAD_RATE = 0.1;
	
	// 受け取る値.
	/** 左上の緯度経度 */
	Point2D _upperLeftLngLat;
	/** 右下の緯度経度 */
	Point2D _lowerRightLngLat;
	/** 地図のサイズ(ピクセル) */
	Point _windowSize;
	/** カテゴリ */
	String _category;
	/** すべてのストロークを返すか */
	boolean _isGetAllStroke = false;
	
	// 求める値.
	/** 緯度経度とxyの変換 */
	ConvertLngLatAppletCoordinate _convert;
	/** ストローク関係 */
	OsmStrokeDataGeom _osmStrokeDataGeom;
	/** fatstroke関係 */
	OsmFatStroke _osmFatStroke;
	/** 順序付けたストロークのインデックス */
	ArrayList<Integer> _orderedStrokeIndexArrayList = new ArrayList<>();
	
	// http://localhost:8080/OsmLeafLet01_01/MainServlet?type=GetFatStrokeServlet&upperLeftLng=136.9255986357495&upperLeftLat=35.161360011718614&lowerRightLng=136.9422370325256&lowerRightLat=35.147695321156014&width=600&height=600&category=Amenity:parking
	public GetFatStrokeServlet(HttpServletRequest request, HttpServletResponse response) {
		// 必須パラメータがあるか.
		if(request.getParameter("upperLeftLng")==null ||
				request.getParameter("upperLeftLat")==null ||
				request.getParameter("lowerRightLng")==null ||
				request.getParameter("lowerRightLat")==null ||
				request.getParameter("width")==null ||
				request.getParameter("height")==null||
				request.getParameter("category")==null
				){
			System.out.println("There is not enough parameters");
			return;
		}
		
		
		// パラメータの受け取り.
		_upperLeftLngLat = new Point2D.Double(Double.parseDouble((request.getParameter("upperLeftLng"))),
				Double.parseDouble((request.getParameter("upperLeftLat"))));
		_lowerRightLngLat = new Point2D.Double(Double.parseDouble((request.getParameter("lowerRightLng"))),
				Double.parseDouble((request.getParameter("lowerRightLat"))));
		_windowSize = new Point(Integer.parseInt(request.getParameter("width")),
				Integer.parseInt(request.getParameter("height")));
		_category = request.getParameter("category");
		_isGetAllStroke = Boolean.parseBoolean(request.getParameter("isGetAllStroke"));
		_convert = new ConvertLngLatAppletCoordinate(_upperLeftLngLat, _lowerRightLngLat, _windowSize);
		
		
		// strokeを取り出す(geomデータはこっちを使う？).
		_osmStrokeDataGeom = new OsmStrokeDataGeom();
		_osmStrokeDataGeom.startConnection();
		_osmStrokeDataGeom.insertStrokeData(_upperLeftLngLat, _lowerRightLngLat);	// ストロークを切り出さない.
		//_osmStrokeDataGeom._cutoutGeojson = _osmStrokeDataGeom._geojson;
		//_osmStrokeDataGeom._subStrokeString = _osmStrokeDataGeom._strokeArcString;
		//_osmStrokeDataGeom._subStrokeArc = _osmStrokeDataGeom._strokeArc;
		_osmStrokeDataGeom.cutOutStroke(_upperLeftLngLat, _lowerRightLngLat);	// 切り出したストロークを求める.
		_osmStrokeDataGeom.endConnection();
		//System.out.println("_cutoutGeojson"+_osmStrokeDataGeom._cutoutGeojson);
		// fatstrokeを取り出す.
		_osmFatStroke = new OsmFatStroke();
		_osmFatStroke.startConnection();
		_osmFatStroke.insertFatStrokeFromMBR(_upperLeftLngLat, _lowerRightLngLat, _category.split(":")[1]);
		_osmFatStroke.endConnection();
		// 各ストロークと紐づく施設データを求める.
		ArrayList<Integer> shopNum = new ArrayList<>();
		for(int i=0; i<_osmStrokeDataGeom._strokeId.size(); i++){
			// 指定したストロークIDがfatstrokeにあるか.
			if(_osmFatStroke._strokeIdToIndexHash.containsKey(_osmStrokeDataGeom._strokeId.get(i))){
			shopNum.add(_osmFatStroke._strokeFacilityNum.get(_osmFatStroke._strokeIdToIndexHash.get(_osmStrokeDataGeom._strokeId.get(i))));
			}else{
				shopNum.add(0);
			}
		}
		
		// すべてのストロークの長さを取り出す.
		double sumShopNum=0, sumStrokeLength=0;
		for(int i=0; i<shopNum.size(); i++){
			sumStrokeLength += _osmStrokeDataGeom._strokeLength.get(i);
		}
		// すべてのお店を取り出す.
		OsmDataGeom osmDataGeom = new OsmDataGeom();
		osmDataGeom.startConnection();
		osmDataGeom.insertFacilityFromCategory(_category.split(":")[0],
				_category.split(":")[1], _upperLeftLngLat, _lowerRightLngLat);
		osmDataGeom.endConnection();
		sumShopNum = osmDataGeom._facilityId.size();
		// 長さとお店の数で並び替え.
		ArrayList<Double> strokeWeight = new ArrayList<>();	// ストロークの重要度(0~1).
		for(int i=0; i<shopNum.size(); i++){
			double shopWeight = sumShopNum > 0 ? (double)shopNum.get(i)/sumShopNum*FACILITY_PARAM : 0;
			//System.out.println(_shopNum.get(i));
			//System.out.println("shopWeight"+shopWeight);
			double lengthWeight = (double)_osmStrokeDataGeom._strokeLength.get(i)/sumStrokeLength*LENGTH_PARAM;
			//System.out.println("lengthWeight"+lengthWeight);
			//System.out.println("strokeLength"+_osmStrokeDataGeom._strokeLength.get(i));
			//System.out.println("strokeLength"+_osmStrokeDataGeom._strokeLength.get(i)/sumStrokeLength*LENGTH_PARAM);
			double weight = (shopWeight + lengthWeight)/2;
			strokeWeight.add(weight);
		}
		ArrayList<Integer> tmp = new ArrayList<>();
		for(int i=0; i<_osmStrokeDataGeom._strokeArc.size(); i++){
			tmp.add(i);
		}
		//System.out.println(strokeWeight);
		//System.out.println("&&");
		//System.out.println(tmp);
		//System.exit(0);
		QuickSort2<Double,Integer> quickSort2 = new QuickSort2<>(strokeWeight, tmp, true);
		_orderedStrokeIndexArrayList = quickSort2.getArrayList2();
		
//		System.out.println("@@@@@@@@@@");
//		for(int i=0; i<_osmStrokeDataGeom._strokeArc.size(); i++){
//			System.out.println("orderedindex"+_orderedStrokeIndexArrayList.get(i));
//			//System.out.println(_osmStrokeDataGeom._strokeArc.get(i));
//			//System.out.println(_osmStrokeDataGeom._geojson.get(i));
//		}
//		System.out.println("@@@@@@@@@@");
//		
		// ストロークの描画する数.
		int drawingStrokeNum = _isGetAllStroke ? _osmStrokeDataGeom._cutoutGeojson.size() :execSoaThreshold();
		ArrayList<String> drawingosmStrokeDataJson = new ArrayList<>();
		for(int i=0; i<drawingStrokeNum; i++){
			drawingosmStrokeDataJson.add(_osmStrokeDataGeom._cutoutGeojson.get(_orderedStrokeIndexArrayList.get(i)));
		}
		CreateGeoJson createGeoJson = new CreateGeoJson();
		createResponse(response, createGeoJson.geoJsonToString(drawingosmStrokeDataJson));
	}
	
	
	/**
	 * 地図サイズによっていくつのストロークを描画するかの閾値を決定.
	 */
	public int execSoaThreshold(){
		int soaThreshold = 0;	// 何個のストロークを表示するか.
		while(true){
			double allLinkLengthAppletCoordinate = 0;// アプレット内の表示されているリンクの長さ.
			for(int i=0; i<soaThreshold && i < _osmStrokeDataGeom._strokeId.size(); i++){	// アプレット内の表示されているリンクの長さを計算する.
				// 簡易版.
				//allLinkLengthAppletCoordinate += _mapPanel._osmStrokeDataGeom._strokeLength.get(_mapPanel._orderedStrokeIndexArrayList.get(i));
				// 簡易2
//				allLinkLengthAppletCoordinate += _mapPanel._osmStrokeDataGeom._strokeLength.get(_mapPanel._orderedStrokeIndexArrayList.get(i))*1 * 42/100 > 700 ?
//						700 : _mapPanel._osmStrokeDataGeom._strokeLength.get(_mapPanel._orderedStrokeIndexArrayList.get(i))*1;
				
				//完全版未完成?(描画されている道路のアップレット内の長さの合計を取得する).
				// 1つのストロークのアプレット内のジオメトリ.
					ArrayList<Line2D> oneArcXy = _convert.convertLngLatToAppletCoordinateLine2D(
							_osmStrokeDataGeom._subStrokeArc.get(_orderedStrokeIndexArrayList.get(i)));
					for(int j=0; j<oneArcXy.size(); j++){
						allLinkLengthAppletCoordinate += oneArcXy.get(j).getP1().distance(oneArcXy.get(j).getP2());
					}
				
			}
			// 道路占有率 = 選択された道路長*太さ / 画像の大きさ.
			double roadRate = (double)(allLinkLengthAppletCoordinate*(float)10/2)
					/(_windowSize.getX()*_windowSize.getY());
			if(roadRate > ROAD_RATE || soaThreshold >  _osmStrokeDataGeom._strokeId.size()-1){
				break;
			}else{
				soaThreshold++;
			}
		}
		return soaThreshold;
	}
	
	
	/**
	 * レスポンスの作成
	 * @param response
	 */
	private void createResponse(HttpServletResponse response, String aGeojson){
		try{
			response.setContentType("text/json; charset=UTF-8");
			PrintWriter out = response.getWriter();
			out.println(aGeojson);
			out.close();
			
			System.out.println("finish");
		}catch(IOException e){
			e.printStackTrace();
		}
	}
}
