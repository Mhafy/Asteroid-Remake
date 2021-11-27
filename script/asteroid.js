
function Asteroid(r){
	this.pos = lookForRandomPos(r);
	this.vel = Vector.random2D().multiply(random(0.5,2));
	this.r = r;
	this.totalPoints = random(5, 15);
	this.color = 0;
	this.plusPoints = r <= 10 ? 100 : (r < 40 && r > 10 ? 50 : (r >= 40 ? 20 : 0));
	this.destroyed = false;

	this.buff = null;
	
	this.lasers = [];
	
	this._points = [];
	this.points  = [];
	this.sides   = [];
	for(let i=0; i<this.totalPoints; i++){
		let angle = map(i, 0, this.totalPoints, 0, TWO_PI);
		let r = this.r + random(-this.r*.5, this.r*.5);
		let x = this.r + (r * cos(angle));
		let y = this.r + (r * sin(angle));
		this._points.push(new Vector(x, y));
	}
}

Asteroid.prototype.update = function(){
	this.pos.add(this.vel);
	
	if(this.pos.x > WIDTH + this.r)this.pos.x = -this.r;
	else if(this.pos.x < -this.r)this.pos.x = WIDTH + this.r;
	if(this.pos.y > HEIGHT + this.r)this.pos.y = -this.r;
	else if(this.pos.y < -this.r)this.pos.y = HEIGHT + this.r;
	
	for(let i=0; i<this._points.length; i++){
		this.points[i] = this._points[i].duplicate().add(this.pos);
	}
	
	for(let i=1; i<this._points.length; i++){
		let a = this._points[i-1].duplicate().add(this.pos);
		let b = this._points[i].duplicate().add(this.pos);
		this.sides[i-1] = [a, b];
	}
	this.sides[this.sides.length-1] = [this._points[this._points.length-1].duplicate().add(this.pos), this._points[0].duplicate().add(this.pos)];
}

Asteroid.prototype.render = function(){
	Stroke(255);
	Fill(this.color);
	ctx.save();
	ctx.beginPath();
	ctx.translate(this.pos.x, this.pos.y);
	for(let v of this._points){
		ctx.lineTo(v.x, v.y);
	}
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	ctx.restore();
	
	this.color = 0;
}

Asteroid.prototype.breakup = function(n, min=20){
	let debris = [];
	if (this.r > min) {
		newLoop(0, n, _ => {
			let a = new Asteroid(this.r * .5);
			a.pos = this.pos.duplicate();
			debris.push(a);
		});
	}
	return debris;
}