package servlet.src;

import java.awt.Point;
import java.awt.geom.Point2D;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mySrc.coordinate.ConvertLngLatAppletCoordinate;
import mySrc.db.getData.OsmRoadDataGeom;
import mySrc.parseGeoJson.others.CreateGeoJson;


/**
 * 必要なパラメータを受け取り、道路データを返す
 * @author murase
 *
 */
public class GetRoadDataServlet {
	
	// 受け取る値.
	/** 左上の緯度経度 */
	Point2D upperLeftLngLat;
	/** 右下の緯度経度 */
	Point2D lowerRightLngLat;
	/** 地図のサイズ(ピクセル) */
	Point windowSize;
	
	// 受け渡す値.
	/** 道路データに関するインスタンス */
	OsmRoadDataGeom _osmRoadDataGeom;

	// http://localhost:8080/OsmLeafLet01_01/MainServlet?type=GetRoadDataServlet&upperLeftLng=136.9255986357495&upperLeftLat=35.161360011718614&lowerRightLng=136.9422370325256&lowerRightLat=35.147695321156014&width=600&height=600
	public GetRoadDataServlet(HttpServletRequest request, HttpServletResponse response){
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
		upperLeftLngLat = new Point2D.Double(Double.parseDouble((request.getParameter("upperLeftLng"))),
				Double.parseDouble((request.getParameter("upperLeftLat"))));
		lowerRightLngLat = new Point2D.Double(Double.parseDouble((request.getParameter("lowerRightLng"))),
				Double.parseDouble((request.getParameter("lowerRightLat"))));
		
		windowSize = new Point(Integer.parseInt(request.getParameter("width")),
				Integer.parseInt(request.getParameter("height")));
		
		System.out.println(upperLeftLngLat);
		System.out.println(lowerRightLngLat);
		System.out.println(windowSize);
		
		
		// 道路データの取得.
		_osmRoadDataGeom = new OsmRoadDataGeom();
		_osmRoadDataGeom.startConnection();
		_osmRoadDataGeom = insertRoadData(upperLeftLngLat, lowerRightLngLat);
//		System.out.println(_osmRoadDataGeom._geojson);
		_osmRoadDataGeom.endConnection();
		CreateGeoJson createGeoJson = new CreateGeoJson();
//		createGeoJson.geoJsonToString(_osmRoadDataGeom._geojson);
//		System.out.println(createGeoJson.geoJsonToString(_osmRoadDataGeom._geojson));
		createResponse(response, createGeoJson.geoJsonToString(_osmRoadDataGeom._geojson));
		

	}
	
	/**
	 * データベースからデータを取得し変数へ格納.
	 */
	private OsmRoadDataGeom insertRoadData(Point2D aUpperLeftLngLat, Point2D aLowerRightLngLat){
		OsmRoadDataGeom osmRoadDataGeom = new OsmRoadDataGeom();
		osmRoadDataGeom.startConnection();
		osmRoadDataGeom.insertOsmRoadData(aUpperLeftLngLat, aLowerRightLngLat);
		osmRoadDataGeom.endConnection();
		return osmRoadDataGeom;
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
