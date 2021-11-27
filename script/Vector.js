
function Vector(x, y){
	if(typeof x === 'undefined')x = 0;
	if(typeof y === 'undefined')y = 0;
	this.x = x;
	this.y = y;
}
Vector.prototype.duplicate = function(){
	return new Vector(this.x, this.y);
};
Vector.prototype.set = function(x, y){
	if( x instanceof Vector ){
		this.x = x.x || 0;
		this.y = x.y || 0;
		return this;
	}
	this.x = x || 0;
	this.y = y || 0;
	return this;
};
Vector.prototype.add = function(x, y){
	if( x instanceof Vector ){
		this.x += x.x || 0;
		this.y += x.y || 0;
		return this;
	}
	this.x += x || 0;
	this.y += y || 0;
	return this;
};
Vector.prototype.subtract = function(x, y){
	if( x instanceof Vector ){
		this.x -= x.x || 0;
		this.y -= x.y || 0;
		return this;
	}
	this.x -= x || 0;
	this.y -= y || 0;
	return this;
};
Vector.prototype.multiply = function(x, y){
	if( x instanceof Vector ){
		this.x *= x.x || 0;
		this.y *= x.y || x.x;
		return this;
	}
	this.x *= x || 0;
	this.y *= y || x;
	return this;
};
Vector.prototype.divide = function(x, y){
	if( x instanceof Vector ){
		this.x /= x.x || 0;
		this.y /= x.y || x.x;
		return this;
	}
	this.x /= x || 0;
	this.y /= y || x;
	return this;
};
Vector.prototype.limit = function(max){
	let mSq = this.duplicate().magSquared();
	if(mSq > max*max){
		this.divide(Math.sqrt(mSq)).multiply(max);
	}
	return this;
};
Vector.prototype.setMagnitude = function(n){
	var len = Math.sqrt(this.magSquared());
	if( len != 0 )this.multiply(1/len);
	return this.multiply(n);
};
Vector.prototype.constrain = function(x1, y1, x2, y2) {
	this.x = Math.max(Math.min(this.x, x2), x1);
	this.y = Math.max(Math.min(this.y, y2), y1);
};
Vector.fromAngle = function(n) {
	return new Vector(Math.cos(n), Math.sin(n));
};
Vector.random2D = function(){
	return this.fromAngle(Math.random() * TWO_PI);
}
Vector.prototype.magSquared = function(){
	return Math.pow(this.x,2)+Math.pow(this.y,2);
};
Vector.prototype.heading = function(){
	return Math.atan2(this.y, this.x);
};
Vector.prototype.getAngle = function(a, b, c, d) {
	if(typeof a === 'number' && typeof b === 'number' && typeof c == 'number' && typeof d === 'number'){
		let v = new Vector(a-c, b-d);
		return v.heading();
	}else if(typeof a === 'number' && typeof b === 'number'){
		let v = this.duplicate().subtract(a, b);
		return v.heading();
	}else if(a instanceof Vector){
		let v = this.duplicate().subtract(a);
		return v.heading();
	}
};
Vector.prototype.getDistance = function(a, b){
	if(a instanceof Vector){
		let v = this.duplicate().subtract(a);
		return Math.sqrt(v.magSquared());
	}else{
		let dx = this.x - a;
		let dy = this.y - b;
		return Math.sqrt(Math.pow(dy, 2)+Math.pow(dx, 2));
	}
};