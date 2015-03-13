package mySrc.parseGeoJson.jsonic.MultiJson;

import java.awt.geom.Point2D;

import mySrc.parseGeoJson.jsonic.PropertiesJson;

public class MultiJson {

	public MultiJson() {
		// TODO 自動生成されたコンストラクター・スタブ
	}

}

class FeaturesMultiJson{
	 private String type;
	 private GeometryMultiJson geometry;
	 private PropertiesJson properties;
	 
	 public void setType(String type){
		 this.type = type;
	 }
	 public void setGeometry(GeometryMultiJson geometry){
		 this.geometry = geometry;
	 }
	 public void setProperties(PropertiesJson properties){
		 this.properties = properties;
	 }
	 public String getType(){
		 return type;
	 }
	 public GeometryMultiJson getGeometry(){
		 return geometry;
	 }
	 public PropertiesJson getProperties(){
		 return properties;
	 }
}
class GeometryMultiJson{
	private String type;
	private Point2D coordinate;
	
	public void setType(String type){
		this.type = type;
	}
	public void setCoordinate(Point2D coordinate){
		this.coordinate = coordinate;
	}
	public String getType(){
		return type;
	}
	public Point2D getCoordinate(){
		return coordinate;
	}
}
