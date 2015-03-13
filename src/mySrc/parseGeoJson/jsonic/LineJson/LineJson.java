package mySrc.parseGeoJson.jsonic.LineJson;

import java.awt.geom.Line2D;
import java.awt.geom.Point2D;
import java.util.ArrayList;

import mySrc.parseGeoJson.jsonic.PropertiesJson;

public class LineJson {

	public LineJson() {
		// TODO 自動生成されたコンストラクター・スタブ
	}

}
class FeaturesLineJson{
	 private String type;
	 private GeometryLineJson geometry;
	 private PropertiesJson properties;
	 
	 public void setType(String type){
		 this.type = type;
	 }
	 public void setGeometry(GeometryLineJson geometry){
		 this.geometry = geometry;
	 }
	 public void setProperties(PropertiesJson properties){
		 this.properties = properties;
	 }
	 public String getType(){
		 return type;
	 }
	 public GeometryLineJson getGeometry(){
		 return geometry;
	 }
	 public PropertiesJson getProperties(){
		 return properties;
	 }
}
class GeometryLineJson{
	private String type;
	private ArrayList<Line2D> coordinate;
	
	public void setType(String type){
		this.type = type;
	}
	public void setCoordinate(ArrayList<Line2D> coordinate){
		this.coordinate = coordinate;
	}
	public String getType(){
		return type;
	}
	public ArrayList<Line2D> getCoordinate(){
		double[] mline = new double[coordinate.size()];
		
		return coordinate;
	}
}