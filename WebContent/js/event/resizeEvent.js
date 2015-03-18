"user strict";
/**
 * リサイズイベントの取得
 *
 *
 */

var g_resizeEvent;

$(function(){
	g_resizeEvent = new ResizeEvent();
});

$(window).resize(function() {

	ResizeEvent.prototype.resizeWindow();
//	console.log($(window).width());
});

function ResizeEvent(){
}

// ウインドウサイズに応じてレイアウトを動的に変更
ResizeEvent.prototype.resizeWindow = function (){
	g_GlobalStaticNumber.windowSize = {x:$(window).width()-320, y:$(window).height()-8};
	$('div#map_element').css('width',g_GlobalStaticNumber.windowSize.x);
	$('div#map_element').css('height',g_GlobalStaticNumber.windowSize.y);
	$('div.tabbox').css('height',g_GlobalStaticNumber.windowSize.y-50);
};

// リサイズ完了したときのイベント取得.
// var timer = false;
// $(window).resize(function() {
//     if (timer !== false) {
//         clearTimeout(timer);
//     }
//     timer = setTimeout(function() {
//         console.log('resized');
//         // 何らかの処理
//     }, 200);
// });