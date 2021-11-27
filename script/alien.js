
function Alien(){
	this.pos = new Vector(floor(random(2))*WIDTH, random(HEIGHT));
	this.vel = new Vector(map(this.pos.x, 0, WIDTH, 1, -1), 0).multiply(0.8);
	this.r = 10;

	this.color = 0;
	
	this.plusPoints = 200;
	this.destroyed = false;
	
	this._points = [];
	this.points  = [];
	this.sides   = [];
	this.lasers = [];
	this.firingTick = 0;
	
	this._points[0] = new Vector(-14, 2);
	this._points[1] = new Vector(-8, -2);
	this._points[2] = new Vector(8, -2);
	this._points[3] = new Vector(14, 2);
	this._points[4] = new Vector(-14, 2);
	this._points[5] = new Vector(-8, 6);
	this._points[6] = new Vector(8, 6);
	this._points[7] = new Vector(14, 2);
	this._points[8] = new Vector(8, -2);
	this._points[9] = new Vector(6, -2);
	this._points[10] = new Vector(4, -8);
	this._points[11] = new Vector(-4, -8);
	this._points[12] = new Vector(-6, -2);
	this._points[13] = new Vector(-8, -2);
	this._points[14] = new Vector(-14, 2);

	this.totalPoints = this._points.length;
}

Alien.prototype.targets = function(enemies){
	if(typeof enemies === 'undefined' || enemies.length <= 0)return;
	let currentTarget = enemies[0][0];
	let closestD = 99999;
	for(let e of enemies[0]){
		if(closestD > this.pos.getDistance(e.pos)){
			closestD = this.pos.getDistance(e.pos);
			currentTarget = e;
		}
	}
	if(this.firingTick % 100 == 0){
		let a = currentTarget.pos.getAngle(this.pos);
		let laser = new Laser(this.pos, a, 2);
		this.lasers.push(laser);
	}
	
	for(let i=0; i<enemies.length; i++){
		let enemy = enemies[i];
		for(let j=this.lasers.length-1; j>=0; j--){
			for(let e of enemy){
				let pos = this.lasers[j].pos;
				if(isInside(e.points, pos)){
					if (e.buff == null || e.buff.type !== Buff.types.shield) e.destroyed = true;
					spawnParticles(pos, 10);
					this.lasers.splice(j, 1);
					break;
				}
			}
		}
	}
}

Alien.prototype.update = function(){
	this.pos.add(this.vel);
	
	if(this.pos.x > WIDTH + this.r*5 || this.pos.x < -this.r*5)this.destroyed = true;
	if(this.pos.y > HEIGHT+ this.r*5 || this.pos.y < -this.r*5)this.destroyed = true;
	
	for(let i=0; i<this._points.length; i++){
		this.points[i] = this._points[i].duplicate().add(this.pos);
	}
	
	for(let i=0; i<this._points.length-1; i++){
		let a = this._points[ i ].duplicate().add(this.pos);
		let b = this._points[i+1].duplicate().add(this.pos);
		this.sides[i] = [a, b];
	}
	
	for(let i=this.lasers.length-1; i>=0; i--){
		this.lasers[i].update();
		if(this.lasers[i].outOfBounds() || this.lasers[i].destroyed){
			this.lasers.splice(i, 1);
		}
	}
	
	this.firingTick += 1;
}

Alien.prototype.render = function(){
	for(let l of this.lasers){
		l.render();
	}
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
}