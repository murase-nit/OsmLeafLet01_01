/**
 * イベント処理
 */
$(function(){
	$(".tab1").bind("click", {text:"#tab1"}, g_changeTab.tabChange);
	$(".tab2").bind("click", {text:"#tab2"}, g_changeTab.tabChange);
	$(".tab3").bind("click", {text:"#tab3"}, g_changeTab.tabChange);
	$(".tab4").bind("click", {text:"#tab4"}, g_changeTab.tabChange);
});
/**
 * デフォルトのタブ
 */
$(function(){
	var tabName ={
			data:{
				text:"#tab1"
			}
	};
	g_changeTab.tabChange(tabName);
	
});

var g_changeTab = new ChangeTab();

function ChangeTab(){
	
}


/**
 * タブ変更
 */
ChangeTab.prototype.tabChange = function(event){
	
	// タブ内容非表示.
	$("div.tab").css("display", "none");
	
//	console.log(""+event.data.text);
	// 非表示ブロック.
	$(""+event.data.text).css("display", "block");
};


















