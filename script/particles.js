
function spawnParticles(pos, n, o=[0.5,2]){
	for(let i=0; i<n; i++){
		particles.push(new Particle(pos, 50, o));
	}
}
function Particle(a, b, n=[0.5,2]){
	this.pos = a.duplicate();
	this.vel = Vector.random2D().multiply(random(n[0],n[1]));
	this.timer = b || 50;
}

Particle.prototype.update = function(){
	this.pos.add(this.vel);
	this.timer -= 1;
}

Particle.prototype.render = function(){
	Fill(map(this.timer, 50, 0, 255, 0));
	Ellipse(this.pos.x, this.pos.y, 2);
	ctx.fill();
}