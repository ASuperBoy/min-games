/* 方块的参数 */
var rectConfig = {
	width : 40,
	height : 40,
	fillColor : ["blue", "pink"],//方块可选的颜色
	strokeColor : ["black", "#dddddd"],
	textColor : "black"
}

/* 所有方块的集合 */
var rects = {
	waitTimeMax : 60,
	waitTimeMin : 45,
	waitTime : 400,
	rectList : [],
	
	/* 初始化 */
	init : function() {
		this.waitTime = 400;
		this.rectList = [];
	},
	
	/* 绘制所有方块
	 * ctx : 画布的上下文
	 * pos : 蛇头的位置
	 * return : 需要删除的蛇节数
	 */
	draw : function(ctx, pos) {
		var index = -1;//记录需删除方块的位置
		var result;//是否发生碰撞及之后需要删除的蛇节数
		var count = 0;//记录需要删除的节点数
		//绘制所有方块
		for (var i=0;i<this.rectList.length;i++) {
			result = this.rectList[i].draw(ctx, pos);
			if (result[0]) {
				count = result[1];
				index = i;
			}
		}
		//删除发生碰撞的方块
		if (count) {
			this.rectList.splice(index, 1);
		}
		//间隔一定时间生成一组新方块
		this.waitTime--;
		if (this.waitTime<=0) {
			this.waitTime = randint(this.waitTimeMin, this.waitTimeMax);
			let num = Math.round(Math.random()*1000);
			for (let i=0;i<7;i++) {
				if (num % 4) {
					var rect = new Rect(i);
					this.rectList.push(rect);
				}
				num = num >> 1;
			}
		}
		//如果最前一个超出边界，则删除
		if (this.rectList.length > 0 && this.rectList[0].pos[1]>parameter.canvasHeight) {
			this.rectList.shift();
		}
		
		return count;
	}
}

/* 方块对象 */
function Rect(index) {
	this.count = randint(1, 5);//方块的计数值
	this.pos = [index*rectConfig.width, -rectConfig.height];
	this.fillColor = rectConfig.fillColor[Math.round(Math.random()*(rectConfig.fillColor.length-1))];
	this.strokeColor = rectConfig.strokeColor[Math.round(Math.random()*rectConfig.strokeColor.length)];
	
	/* 绘制矩形
	 * ctx : 画布的上下文
	 * pos : 蛇头的位置
	 * return : 是否发生碰撞
	 */
	this.draw = function(ctx, pos) {
		var x = this.pos[0];
		var y = this.pos[1];
		//绘制矩形
		ctx.fillStyle = this.fillColor;
		ctx.fillRect(x, y, rectConfig.width, rectConfig.height);
		ctx.strokStyle = this.strokeColor;
		ctx.strokeRect(x, y, rectConfig.width, rectConfig.height)
		//绘制矩形中的数字
		var font = ctx.font;
		ctx.font = "20pt Calibri";
		ctx.fillStyle = rectConfig.textColor;
		ctx.fillText(this.count, x+rectConfig.width/2-7, y+rectConfig.height/2+8);
		ctx.font = font;
		//向下移动
		this.pos[1] += parameter.move;
		//检测是否发生碰撞
		var r = snakeConfig.bodyRadius;
		if (this.pos[0]<pos[0]+r && this.pos[0]+rectConfig.width>pos[0]-r && this.pos[1]<pos[1]+r && this.pos[1]+rectConfig.height>pos[1]-r) {
			return [true, this.count];
		} else {
			return [false, 0];
		}
	}
}

//生成 x 到 y 之间的随机整数，包括x,y
function randint(x, y) {
	return Math.round(Math.random()*(y-x)+x);
}