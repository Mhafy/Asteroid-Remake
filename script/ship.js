
function Ship(r){
	this.pos = new Vector(WIDTH/2, HEIGHT/2);
	this.vel = new Vector(0, 0);
	this.r = r || 10;
	this.heading = -HALF_PI;
	this.boosting = false;
	this.canShoot = false;
	this.invulnerable = true;
	this.vulnerabilityTimer = 0;
	this.destroyed = false;

	this.buff = null;
	
	this.lasers = [];

	this._points = [];
	this.points  = [];
	this.sides   = [];
	this._points.push(new Vector(-this.r * .8, this.r * 1.8));
	this._points.push(new Vector(0, -this.r));
	this._points.push(new Vector( this.r * .8, this.r * 1.8));
	this._points.push(new Vector( this.r * .6, this.r));
	this._points.push(new Vector(-this.r * .6, this.r));
	this._points.push(new Vector(-this.r * .8, this.r * 1.8));
}

Ship.prototype.update = function(){
	this.pos.add(this.vel);
	this.vel.multiply(0.98);
	
	if(this.pos.x > WIDTH + this.r)this.pos.x = -this.r;
	else if(this.pos.x < -this.r)this.pos.x = WIDTH + this.r;
	if(this.pos.y > HEIGHT + this.r)this.pos.y = -this.r;
	else if(this.pos.y < -this.r)this.pos.y = HEIGHT + this.r;
	
	if(this.invulnerable){
		this.vulnerabilityTimer++;
		if(this.vulnerabilityTimer >= 100){
			this.invulnerable = false;
			this.vulnerabilityTimer = 0;
		}
	}
	
	for(let i=0; i<this._points.length; i++){
		this.points[i] = this._points[i].duplicate().add(this.pos);
	}
	
	for(let i=1; i<this._points.length; i++){
		let a = this._points[i-1].duplicate().add(this.pos);
		let b = this._points[i].duplicate().add(this.pos);
		this.sides[i-1] = [a, b];
	}
	this.sides[this.sides.length-1] = [this._points[this._points.length-1].duplicate().add(this.pos), this._points[0].duplicate().add(this.pos)];
	
	for(let i=this.lasers.length-1; i>=0; i--){
		this.lasers[i].update();
		if(this.lasers[i].outOfBounds() || this.lasers[i].destroyed){
			this.lasers.splice(i, 1);
		}
	}

	if (this.buff != null) {
		this.buff.update();
		if (this.buff.destroyed) this.buff = null;
    }
};

Ship.prototype.shoot = function(){
	if(!this.canShoot)return;
	this.canShoot = false;
	this.lasers.push(new Laser(this.pos, this.heading));
}

Ship.prototype.targets = function(enemies){
	if(typeof enemies === 'undefined' || enemies.length <= 0)return;
	for(let enemy of enemies){
		for(let i=this.lasers.length-1; i>=0; i--){
			for(let e of enemy){
				let pos = this.lasers[i].pos;
				if(isInside(e.points, pos)){
					if (e.buff == null || e.buff.type !== e.types.shield) e.destroyed = true;
					score += e.plusPoints;
					spawnParticles(pos, 10);
					this.lasers.splice(i, 1);
					spawnAlien();
					return;
				}
			}
		}
	}
	for(let enemy of enemies){
		for(let i=this.lasers.length-1; i>=0; i--){
			for(let e of enemy){
				for(let l=e.lasers.length-1; l>=0; l--){
					let pos = this.lasers[i].pos;
					let otr = e.lasers[l].pos;
					if(otr.getDistance(pos) <= 5){
						spawnParticles(pos, 10);
						e.lasers[l].destroyed = true;
						this.lasers.splice(i, 1);
						return;
					}
				}
			}
		}
	}
}

Ship.prototype.boost = function(){
	let force = Vector.fromAngle(this.heading);
	force.multiply(0.15);
	this.vel.add(force);
	this.boosting = true;
};

Ship.prototype.render = function(){
	for(let l of this.lasers){
		l.render();
	}
	Fill(0);
	if(this.invulnerable){
		Stroke(100 * (new Date().getMilliseconds()%4));
	}else Stroke(255);
	ctx.save();
	Translate(this.pos.x, this.pos.y);
	ctx.rotate(this.heading + HALF_PI);
	ctx.beginPath();
	for(let i=0; i<this._points.length; i++){
		ctx.lineTo(this._points[i].x, this._points[i].y);
	}
	ctx.moveTo( this.r * .6, this.r);
	ctx.lineTo(-this.r * .6, this.r);
	
	
	if(this.boosting){
		if(new Date().getMilliseconds() % 2 == 0){
			let w = (this.r * .3) + random(-2, 2);
			ctx.moveTo( w, this.r);
			ctx.lineTo(0, (this.r * 2) + random(2));
			ctx.lineTo(-w, this.r);
		}
	}
	
	
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

	if (this.buff != null && this.buff.type === Buff.types.shield) {
		Stroke(this.buff.color);
		Ellipse(0, this.r * .5, (this.r * 2) * 2);
		ctx.stroke();
	}

	ctx.restore();
	
	this.boosting = false;
};

Ship.prototype.turn = function(a){
	this.heading += a;
};