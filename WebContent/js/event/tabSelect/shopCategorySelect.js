// Whole-script strict mode syntax
"use strict";

/**
 * 施設カテゴリの選択処理
 */


/** カテゴリの表示 */
window.onload = function(){
			for(var key in g_shopName){
				for(var i=0; i<g_shopName[key].length; i++){
					//console.log("i:"+i+" j:"+j);
					$("div#tab2").append(
							"<label for='category"+(key)+(i)+"'>"+
							"<input type='checkbox' id='category"+(key)+(i)+"'>"+key+":"+g_shopName[key][i] +
							"</label>"+
							"<br>");
				}
			}
}

$(function(){
	/** "すべて"を押すとすべての項目をチェック */
	//$("div.tab").children().children(":first").bind("click", allCheck);
	$("div#tab2").children(":first").children().bind("click", g_shopCategorySelect.allCheck);
	/** "すべて"以外をチェック */
	//$("div.tab").children().children(":gt(1)").bind("click", uncheckAll);
	$("div#tab2").children(":gt(0)").children().bind("click", g_shopCategorySelect.uncheckAll);
	
});

var g_shopCategorySelect = new ShopCategorySelect();

function ShopCategorySelect(){
	
}

/** すべての項目をチェックする */
ShopCategorySelect.prototype.allCheck = function(){
	if ($(this).is(':checked')) {
	//	$(this).p();//input#category11
		$(this).parent().siblings("label").find("input").prop("checked", true);
	} else {
		$(this).parent().siblings("label").find("input").prop("checked", false);
	}
};

/** "すべて"の項目にチェックが入っているときにそれ以外をチェックしたときに、"すべて"の項目のチェックを外す */
ShopCategorySelect.prototype.uncheckAll =  function(){
	if(!($(this).is(':checked'))){
		$(this).parent().parent().children(":first").children().prop("checked", false);
	}
};


