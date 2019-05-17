/* 所有食物 */
var foods = {
	waitTimeMax : 30,
	waitTimeMin : 10,
	waitTime : 0,
	foodList : [],
	foodRadius : 3,
	foodColor : "red",
	
	/* 初始化 */
	init : function() {
		this.waitTime = 0;
		this.foodList = [];
	},
	
	/* 绘制所有的食物
	 * ctx : 画布的上下文对象
	 * pos : 蛇的位置，以供碰撞检测
	 */
	draw : function(ctx, pos) {
		var flag = false;//标记是否发生碰撞
		var index = -1;//记录需删除食物的位置
		//绘制所有食物
		for(var i=0;i<this.foodList.length;i++) {
			if (this.foodList[i].draw(ctx, pos)) {
				flag = true;
				index = i;
			}
		}
		//删除被吃掉的食物
		if (flag) {
			this.foodList.splice(index, 1);
		}
		//间隔一定时间生成新食物
		this.waitTime--;
		if (this.waitTime<=0) {
			this.waitTime = Math.round(Math.random()*(this.waitTimeMax-this.waitTimeMin)+this.waitTimeMin);
			var food = new Food();
			this.foodList.push(food);
		}
		//如果最前一个超出边界，则删除
		if (this.foodList.length > 0 && this.foodList[0].pos[1]>parameter.canvasHeight) {
			this.foodList.shift();
		}
		
		return flag;
	}
};

/* 食物对象 */
function Food() {
	this.pos = [Math.round(Math.random()*parameter.canvasWidth), 0];
	
	/* 绘制食物
	 * ctx : 画布的上下文对象
	 * pos : 蛇头位置，以供碰撞检测
	 * return : 是否发生碰撞
	 */
	this.draw = function(ctx, pos) {
		ctx.beginPath();
		ctx.arc(this.pos[0], this.pos[1], foods.foodRadius, 0, 2*Math.PI);
		ctx.closePath();
		ctx.fillStyle = foods.foodColor;
		ctx.fill();
		//绘制完之后向下移动位置
		this.pos[1] += parameter.move;
		//检测是否发生碰撞
		var r = snakeConfig.bodyRadius;
		if (this.pos[0]>pos[0]-r && this.pos[0]<pos[0]+r && this.pos[1]>pos[1]-r && this.pos[1]<pos[1]+r) {
			return true;
		} else {
			return false;
		}
	}
}