package servlet.src;

import java.awt.Point;
import java.awt.geom.Point2D;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mySrc.QuickSort2;
import mySrc.coordinate.ConvertLngLatAppletCoordinate;
import mySrc.db.getData.OsmFatStroke;
import mySrc.db.getData.OsmStrokeDataGeom;
import mySrc.parseGeoJson.others.CreateGeoJson;

/**
 * 必要なパラメータを受け取り、長い順にstrokeを表示する
 * @author murase
 *
 */
public class GetStrokeServlet {
	
	/** 道路をいくつ描画するか */
	public static final int ROAD_DRAW_NUM = 30;
	
	// 受け取る値.
	/** 左上の緯度経度 */
	Point2D _upperLeftLngLat;
	/** 右下の緯度経度 */
	Point2D _lowerRightLngLat;
	/** 地図のサイズ(ピクセル) */
	Point _windowSize;
	/** すべてのストロークを返すか */
	boolean _isGetAllStroke = false;
	
	// 求める値.
	/** 緯度経度とxyの変換 */
	ConvertLngLatAppletCoordinate _convert;
	/** ストローク関係 */
	OsmStrokeDataGeom _osmStrokeDataGeom;
	/** 順序付けたストロークのインデックス */
	ArrayList<Integer> _orderedStrokeIndexArrayList = new ArrayList<>();

	// http://localhost:8080/OsmLeafLet01_01/MainServlet?type=GetStrokeServlet&upperLeftLng=136.9255&upperLeftLat=35.161&lowerRightLng=136.9422370325256&lowerRightLat=35.147695321156014&width=600&height=600&isGetAllStroke=false
	public GetStrokeServlet(HttpServletRequest request, HttpServletResponse response) {
		// 必須パラメータがあるか.
		if(request.getParameter("upperLeftLng")==null ||
				request.getParameter("upperLeftLat")==null ||
				request.getParameter("lowerRightLng")==null ||
				request.getParameter("lowerRightLat")==null ||
				request.getParameter("width")==null ||
				request.getParameter("height")==null
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
		_isGetAllStroke = Boolean.parseBoolean(request.getParameter("isGetAllStroke"));
		_convert = new ConvertLngLatAppletCoordinate(_upperLeftLngLat, _lowerRightLngLat, _windowSize);
		
		// strokeを取り出す(geomデータはこっちを使う？).
		_osmStrokeDataGeom = new OsmStrokeDataGeom();
		_osmStrokeDataGeom.startConnection();
		_osmStrokeDataGeom.insertStrokeData(_upperLeftLngLat, _lowerRightLngLat);	// ストロークを切り出さない.
		_osmStrokeDataGeom.cutOutStroke(_upperLeftLngLat, _lowerRightLngLat);	// 切り出したストロークを求める.
		// すべてのストロークの長さを取り出す.
		ArrayList<Double> strokeWeight = new ArrayList<>();	// ストロークの重要度(0~1).
		for(int i=0; i<_osmStrokeDataGeom._strokeLength.size(); i++){
			strokeWeight.add(_osmStrokeDataGeom._strokeLength.get(i));
		}
		// 長さ順にソート.
		ArrayList<Integer> tmp = new ArrayList<>();
		for(int i=0; i<_osmStrokeDataGeom._strokeArc.size(); i++){
			tmp.add(i);
		}
		QuickSort2<Double,Integer> quickSort2 = new QuickSort2<>(strokeWeight, tmp, true);
		_orderedStrokeIndexArrayList = quickSort2.getArrayList2();
		
		// ストロークの描画する数.
		int drawingStrokeNum = _isGetAllStroke ? _osmStrokeDataGeom._cutoutGeojson.size() : ROAD_DRAW_NUM;
		ArrayList<String> drawingosmStrokeDataJson = new ArrayList<>();
		for(int i=0; i<drawingStrokeNum; i++){
			drawingosmStrokeDataJson.add(_osmStrokeDataGeom._cutoutGeojson.get(_orderedStrokeIndexArrayList.get(i)));
		}
		CreateGeoJson createGeoJson = new CreateGeoJson();
		createResponse(response, createGeoJson.geoJsonToString(drawingosmStrokeDataJson));
		
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
