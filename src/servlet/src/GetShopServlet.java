package servlet.src;

import java.awt.Point;
import java.awt.geom.Point2D;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mySrc.db.getData.OsmDataGeom;
import mySrc.parseGeoJson.others.CreateGeoJson;


/**
 * 指定した施設データを表示する
 * @author murase
 *
 */
public class GetShopServlet {
	// 受け取る値.
	/** 左上の緯度経度 */
	Point2D upperLeftLngLat;
	/** 右下の緯度経度 */
	Point2D lowerRightLngLat;
	/** 地図のサイズ(ピクセル) */
	Point windowSize;
	
	// 受け渡す値.
	OsmDataGeom _osmDataGeom;
	
	// http://localhost:8080/OsmLeafLet01_01/MainServlet?type=GetShopServlet&upperLeftLng=136.9255986357495&upperLeftLat=35.161360011718614&lowerRightLng=136.9422370325256&lowerRightLat=35.147695321156014&width=600&height=600&category=Amenity:parking
	/**
	 * 施設データを返す
	 * @param request
	 * @param response
	 */
	public GetShopServlet(HttpServletRequest request, HttpServletResponse response) {
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
		String category = request.getParameter("category");
		
		System.out.println(upperLeftLngLat);
		System.out.println(lowerRightLngLat);
		System.out.println(windowSize);
		System.out.println(category);
		
		// 施設データの取得.
		_osmDataGeom = new OsmDataGeom();
		_osmDataGeom.startConnection();
		_osmDataGeom.insertFacilityFromCategory(category.split(":")[0], category.split(":")[1], upperLeftLngLat, lowerRightLngLat);
		_osmDataGeom.endConnection();
		CreateGeoJson createGeoJson = new CreateGeoJson();
		createResponse(response, createGeoJson.geoJsonToString(_osmDataGeom._geojson));
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
