
function Buff(pos, type, timer) {
    this.pos = pos.duplicate();
    this.type = type || Buff.types.health;
    this.timer = timer || 1000;
    this.flickerTick = 0;

    this.color = 255;
    this.destroyed = false;

    let s = new Ship(3);

    this.r = s.r;

    this._points = s._points;
    this.points = [];
    this.sides = [];
    this._points.push(new Vector(-this.r * .8, this.r * 1.8));
    this._points.push(new Vector(0, -this.r));
    this._points.push(new Vector(this.r * .8, this.r * 1.8));
    this._points.push(new Vector(this.r * .6, this.r));
    this._points.push(new Vector(-this.r * .6, this.r));
    this._points.push(new Vector(-this.r * .8, this.r * 1.8));
}

Buff.prototype.update = function () {
    if (this.timer <= 0) this.destroyed = true;
    else this.timer -= 1;
    this.flickerTick++;

    if (this.flickerTick % floor(map(this.timer, 2000, 0, 50, 5)) === 0) {
        if (this.color == 255) this.color = 100;
        else this.color = 255;
    }

    newLoop(0, this._points.length, i => {
        this.points[i] = this._points[i].duplicate().add(this.pos);
    });
    newLoop(1, this._points.length, i => {
        let a = this._points[i - 1].duplicate().add(this.pos);
        let b = this._points[i].duplicate().add(this.pos);
        this.sides[i - 1] = [a, b];
    });
    this.sides[this.sides.length - 1] = [this._points[this._points.length - 1].duplicate().add(this.pos), this._points[0].duplicate().add(this.pos)];
}

Buff.prototype.render = function () {
    Fill(this.color);
    Stroke(this.color);

	ctx.save();
	Translate(this.pos.x, this.pos.y);
    ctx.rotate(this.heading + HALF_PI);

    ctx.beginPath();
	for (let i = 0; i < this._points.length; i++) {
		ctx.lineTo(this._points[i].x, this._points[i].y);
	}
	ctx.moveTo(this.r * .6, this.r);
    ctx.lineTo(-this.r * .6, this.r);
    ctx.fill();

    ctx.closePath();
	ctx.stroke();

    if (this.type === Buff.types.health) {
        Font(this.r+6);
        FillString(-this.r * 2.5, this.r * 1.5 , "+");
    }else if (this.type === Buff.types.shield) {
        Ellipse(0, this.r*.5, (this.r * 2) * 2);
        ctx.stroke();
    }

    ctx.restore();
}

Buff.types = {
    shield: "shield",
    health: "health"
};