package mySrc.parseGeoJson.others;

import java.util.ArrayList;
import java.util.HashMap;


/**
 * PointGISからGeoJsonを作成する
 * @author murase
 *
 */
public class CreateGeoJson {

	public CreateGeoJson() {
		
	}
	
	/**
	 * postgisでgeojson形式に変換した文字列をgeojson文字列へ変換
	 * @param aPostGisJson
	 * @return
	 */
	public String geoJsonToString(ArrayList<String> aPostGisJson){
		String geojson = "";
		geojson +=
				"{\"type\": \"FeatureCollection\",\n" +
					"\t\"features\": [\n";
		for(int i=0; i<aPostGisJson.size(); i++){
			geojson +=  "\t\t{\n" +
							"\t\t\t\"type\": \"Feature\",\n" +
							"\t\t\t\"geometry\": "+aPostGisJson.get(i)+"\n" +
//						"\"properties\": {....}\n"+
						"\t\t},\n";
		}
		geojson = geojson.substring(0, geojson.length()-2);	// 最後のカンマ削除.
		geojson += "]" +
				"}";
		
		return geojson;
	}
	
	
	

}
