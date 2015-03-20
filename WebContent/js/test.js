/**
* テスト用クラス
*
*/
function Test(){
	this.mem1 = null;
	this.mem2 = null;
	this.mem3 = null;
}


Test.prototype.f1 = function(){
	this.mem1 = 5;
};

Test.prototype.f2 = function(){
	this.mem1 = 6;
};

Test.prototype.f3 = function(){
	this.mem1 = 7;
};


 var inst1 = new Test();
 var inst2 = new Test();
 var inst3 = new Test();
 var inst4 = new Test();


inst1.f1();
console.log("f1");
console.info(inst1);
console.info(inst1.mem1);
console.info(inst2);
console.info(inst3);
inst1.f2();
console.log("f2");
console.info(inst1);
console.info(inst1.mem1);
console.info(inst2);
console.info(inst3);

