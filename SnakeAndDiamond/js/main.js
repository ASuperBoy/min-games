/* 全局参数设置 */
var parameter = {
	canvasWidth : 280,
	canvasHeight : 500,
	move : 3 //上下移动速度，值在9以下，单位：像素每帧
}

var canvas = document.getElementById("main");
var ctx = canvas.getContext("2d");

//当方向键被按下时，设置移动标志
var moveFlag = 0;
document.onkeydown = function(event) {
	var e = event || window.event;
	switch(e.keyCode) {
		case 37://左方向键
			moveFlag = -1;
			break;
		case 39://右方向键
			moveFlag = 1;
			break;
	}
};
//当方向键被松开时，设置按下标志为false
document.onkeyup = function() {
	moveFlag = 0;
}

//结束标志
var endFlag = false;
//分数
var score = 0;
//显示分数的节点
var scorediv = document.getElementById("score");

//绘制所有
function start() {
	requestAnimationFrame(function step() {
		ctx.clearRect(0, 0, parameter.canvasWidth, 500);
		snake.move(moveFlag);//移动
		var pos = snake.draw();//绘制蛇，返回蛇头位置
		if (!endFlag) {
			requestAnimationFrame(step);
			var flag = foods.draw(ctx, pos);//绘制食物，返回蛇是否吃到食物
			//如果蛇吃到食物，蛇增加一个节点
			if (flag) {
				snake.add();
			}
			//绘制方块，如果发生碰撞则删除对应的蛇节数
			var count = rects.draw(ctx, pos);
			if (count) {
				snake.del(count);
			}
		} else {
			endFace();
		}
		//显示分数
		score += parameter.move;
		scorediv.innerText = score;
	});
}

//开始界面
var startdiv = document.getElementById("start");
var btnStart = document.getElementById("btn-start");
var enddiv = document.getElementById("end");
var btnRestart = document.getElementById("restart");
var result = document.getElementById("result");
btnStart.onclick = function() {
	startdiv.style = "display:none";
	start();
}
btnRestart.onclick = function() {
	enddiv.style = "display:none";
	scorediv.style = "display:block";
	snake.add();
	endFlag = false;
	snake.init();
	foods.init();
	rects.init();
	score = 0;
	start();
}
//游戏结束时调用的函数
function endFace() {
	ctx.clearRect(0, 0, parameter.canvasWidth, 500);
	result.innerText = score;
	scorediv.style = "display:none";
	enddiv.style = "display:block";
}
