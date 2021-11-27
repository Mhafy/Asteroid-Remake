
function Laser(pos, angle, speed){
	this.pos = pos.duplicate();
	this.vel = Vector.fromAngle(angle);
	this.vel.multiply(speed || 5);
	this.angle = angle;
	
	this.destroyed = false;
	
	this._points = [];
	this.points  = [];
	for(let i=0; i<32; i++){
		let angle = map(i, 0, 32, 0, TWO_PI);
		let x = 2 * cos(angle);
		let y = 2 * sin(angle);
		this._points.push(new Vector(x, y));
	}
}

Laser.prototype.update = function(){
	this.pos.add(this.vel);
	
	for(let i=0; i<this._points.length; i++){
		this.points[i] = this._points[i].duplicate().add(this.pos);
	}
}

Laser.prototype.render = function(){
	Fill(255);
	Ellipse(this.pos.x, this.pos.y, 4);
	ctx.fill();
}

Laser.prototype.outOfBounds = function(){
	return (this.pos.x > WIDTH || this.pos.x < 0 || this.pos.y > HEIGHT || this.pos.y < 0);
}