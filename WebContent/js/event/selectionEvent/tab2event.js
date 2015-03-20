
var g_tab2event = new Tab2Event();

function Tab2Event(){
	/** 最後にチェックしたカテゴリ */
	this.checkedCategoryLast = "Amenity:parking";
}


$(function(){
	//  タブの変更イベント処理
	$(".tab1").bind("click", {text:"#tab1"}, g_tab2event.tabChange);
	$(".tab2").bind("click", {text:"#tab2"}, g_tab2event.tabChange);
	$(".tab3").bind("click", {text:"#tab3"}, g_tab2event.tabChange);
	$(".tab4").bind("click", {text:"#tab4"}, g_tab2event.tabChange);
	// ボタン押したときのイベント.
	$("#drawShop").children.bind("click", g_tab2event.drawShop);

	// デフォルトのタブ.
		var tabName ={
			data:{
				text:"#tab1"
			}
	};
	g_tab2event.tabChange(tabName);
});

/**
 * ページ読み込み後の処理.
 */
g_tab2event.init= function(){
	// カテゴリの表示
	for(var key in g_tab2event.shopName){
		for(var i=0; i<g_tab2event.shopName[key].length; i++){
			//console.log("i:"+i+" j:"+j);
			$("div#tab2").append(
					"<label for='category"+(key)+(i)+"'>"+
					"<input type='checkbox' id='category"+(key)+(i)+"'>"+key+":"+g_tab2event.shopName[key][i] +
					"</label>"+
					"<br>");
		}
	}
	/** "すべて"を押すとすべての項目をチェック */
	$("div#tab2>label>input[type=checkbox]:first").bind("click", g_tab2event.allCheck);
	/** "すべて"以外をチェック */
	$("div#tab2>label>input[type=checkbox]:gt(0)").bind("click", g_tab2event.uncheckAll);
	/** デフォルトでparkingをチェック */
	$("input[id=categoryAmenity4]").prop("checked", true);
	// チェックしたときのイベント.
	$("div#tab2>label>input[type=checkbox]").click(g_tab2event.clickCheckbox);
};

/**
 * カテゴリの種類.
 */
Tab2Event.prototype.shopName = {
	"All":["All"],
	"Amenity" :["cafe","fast_food","pub","restaurant","parking","hospital","vending_machine"],
	"shop" : ["convenience","clothes","supermarket","book"],
	"hightway" : ["traffic_signals"]
};


/**
 * すべての項目をチェックする
 */
Tab2Event.prototype.allCheck = function(){
	console.log("allCheck");
	if ($(this).is(':checked')) {
	//	$(this).p();//input#category11
		$(this).parent().siblings("label").find("input").prop("checked", true);
	} else {
		$(this).parent().siblings("label").find("input").prop("checked", false);
	}
};

/**
 * "すべて"の項目にチェックが入っているときにそれ以外をチェックしたときに、"すべて"の項目のチェックを外す
 */
Tab2Event.prototype.uncheckAll =  function(){
	if(!($(this).is(':checked'))){
		$(this).parent().siblings("label[for=categoryAll0]").children().prop("checked", false);
	}
};

/**
 * タブ変更
 */
Tab2Event.prototype.tabChange = function(event){
	
	// タブ内容非表示.
	$("div.tab").css("display", "none");
	
//	console.log(""+event.data.text);
	// 非表示ブロック.
	$(""+event.data.text).css("display", "block");
};
/*
 * 施設データの表示
 */
Tab2Event.prototype.drawShop = function(){

};

/*
 * 施設データをチェックしたときの処理
 */
Tab2Event.prototype.clickCheckbox = function(){
	if($(this).is(':checked')){
		g_tab2event.checkedCategoryLast = $(this).parent().text();
	}
};