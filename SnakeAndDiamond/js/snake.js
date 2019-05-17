/* 蛇的参数 */
var snakeConfig = {
	beginPos : [150, 340],	//开始位置
	countRadius : 8,		//计数球半径
	countTextColor : "rgba(0, 0, 0, 0.2)",//计数球数字颜色
	moveSpeed : 5,			//蛇的左右移动速度
	bodyRadius : 8,			//蛇的身体半径
	bodyColor : ["#00ffcc", "red", "hotpink", "#66ccff"],//身体颜色
};

/* 蛇对象 */
var snake = {
	countPos : snakeConfig.beginPos.slice(0),//计数球位置
	nodeCount : 1,//节点数
	nodeList : [],//节点对象列表
	
	/* 初始化 */
	init : function() {
		this.countPos = snakeConfig.beginPos.slice(0);
		this.nodeCount = 1;
		this.nodeList = [];
	},
	
	/* 绘制蛇对象
	 * return : 第一个节点的位置
	 */
	draw : function() {
		this.drawCount(this.countPos);
		return this.drawAllNode();
	},
	
	/* 绘制蛇头前的计数球
	 */
	drawCount : function() {
		var x = this.countPos[0];
		var y = this.countPos[1];
		ctx.beginPath();
		ctx.arc(x, y, snakeConfig.countRadius, 0, 2*Math.PI);
		ctx.closePath();
		ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
		ctx.stroke();
		var textx = x - 4;
		if (this.nodeCount > 9) {
			textx -= 4
		}
		ctx.fillStyle = snakeConfig.countTextColor;
		ctx.fillText(this.nodeCount, textx, y+5);
	},
	
	/* 绘制蛇的所有节点
	 * return : 返回第一个节点的位置
	 */
	drawAllNode : function() {
		//依次绘制所有节点
		for (var i=this.nodeCount-1;i>=0;i--) {
			if (i<this.nodeList.length) {
				//绘制原来的节点
				var node = this.nodeList[i];
				if (i>0 && this.nodeList[i-1].position[0] != node.position[0]) {
					var walkStep = Math.round((this.nodeList[i-1].position[0] - node.position[0]) / (9-parameter.move));
					if (walkStep == 0) {
						if (this.nodeList[i-1].position[0] < node.position[0]) {
							walkStep = -1;
						} else {
							walkStep = 1;
						}
					}
					node.position[0] += walkStep;
						
				}
			} else if(this.nodeList.length==0){
				//第一个节点
				var node = new SnakeNode([this.countPos[0], this.countPos[1]+snakeConfig.countRadius+snakeConfig.bodyRadius]);
				this.nodeList.push(node);
			} else {
				//绘制新的节点
				var node = this.nodeList[this.nodeList.length-1];
				var pos = [node.position[0], node.position[1]+snakeConfig.bodyRadius*2];
				node = new SnakeNode(pos);
				this.nodeList.push(node);
			}
			node.draw();
		}
		//如果超出记录的节点数，则删除多余的蛇节
		for (var i=this.nodeList.length-1;i>this.nodeCount-1;i--) {
			this.nodeList.pop();
		}
		//返回第一个节点的位置
		if (this.nodeList.length == 0) {
			endFlag = true;
		} else {
			return this.nodeList[0].position;
		}
	},
	
	/* 移动蛇，可显示为多段 */
	move : function(moveFlag) {
		if (moveFlag == -1) {
			//重设计数球的位置,禁止越过左边界
			if (snake.countPos[0]-snakeConfig.bodyRadius > 0) {
				snake.countPos[0] -= snakeConfig.moveSpeed;
				//重设第一个节点的位置
				snake.nodeList[0].position[0] -= snakeConfig.moveSpeed;
			}
		} else if (moveFlag == 1) {
			//重设计数球的位置,禁止越过右边界
			if (snake.countPos[0]+snakeConfig.bodyRadius < parameter.canvasWidth) {
				snake.countPos[0] += snakeConfig.moveSpeed;
				//重设第一个节点的位置
				snake.nodeList[0].position[0] += snakeConfig.moveSpeed;
			}
		}
	},
	
	/* 给蛇增加一个节点 */
	add : function() {
		this.nodeCount++;
	},
	
	/* 删除指定数量的节点 */
	del : function(count) {
		this.nodeCount -= count;
	}
}



/* 蛇节点对象 */
function SnakeNode(pos) {
	this.position = pos;
	this.color = snakeConfig.bodyColor[Math.round(Math.random()*(snakeConfig.bodyColor.length-1))];
	this.wait = snakeConfig.bodyRadius*2;//前一个节点位置改变时的等待帧数
	
	/* 绘制一个节点
	 * pos : [x, y]--绘制的位置
	 * index : 蛇身体的次序
	 */
	this.draw = function() {
		var x = this.position[0];
		var y = this.position[1];
		
		ctx.beginPath();
		ctx.arc(x, y, snakeConfig.bodyRadius, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
	}
}