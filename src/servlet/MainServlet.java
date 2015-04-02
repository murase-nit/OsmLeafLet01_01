package servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import servlet.src.GetFatStrokeServlet;
import servlet.src.GetRoadDataServlet;
import servlet.src.GetShopServlet;

/**
 * メインのサーブレット
 * Servlet implementation class MainServlet
 */
@WebServlet(name="MainServlet",urlPatterns={"/MainServlet"})// このアノテーションでweb.xml不要になる.
public class MainServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public MainServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

    /**
	 * @see HttpServlet#HttpServlet()
	 * getリクエスト  http://localhost/projectName/MainServlet?
	 * type=...&.....
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// パラメータの受け取り.
		String type="";	// サーバのやること.
		
		System.out.println("postRequest");
		
		if(request.getParameter("type")==null){
			System.out.println("\"type\" parameter not found");
			return;
		}
		
		type = request.getParameter("type");
		switch(type){
		case "GetRoadDataServlet":
			new GetRoadDataServlet(request, response);
			break;
		case "GetFatStrokeServlet":
			new GetFatStrokeServlet(request, response);
			break;
		case "GetShopServlet":
			new GetShopServlet(request, response);
			break;
		case "" :
			break;
		default:
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 * postリクエスト
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
