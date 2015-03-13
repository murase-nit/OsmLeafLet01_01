package mySrc.parseGeoJson.jsonic.PointJson;

import java.awt.geom.Point2D;
import mySrc.parseGeoJson.*;
import mySrc.parseGeoJson.jsonic.PropertiesJson;
import net.arnx.jsonic.JSON;

public class PointJson {

	public PointJson() {
		
	}

}


class FeaturesPointJson{
	 private String type;
	 private GeometryPointJson geometry;
	 private PropertiesJson properties;
	 
	 public void setType(String type){
		 this.type = type;
	 }
	 public void setGeometry(GeometryPointJson geometry){
		 this.geometry = geometry;
	 }
	 public void setProperties(PropertiesJson properties){
		 this.properties = properties;
	 }
	 public String getType(){
		 return type;
	 }
	 public GeometryPointJson getGeometry(){
		 return geometry;
	 }
	 public PropertiesJson getProperties(){
		 return properties;
	 }
}
class GeometryPointJson{
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
