let ship;
let aliens = [];
let lasers = [];
let buffs  = [];
let asteroids = [];
let particles = [];

let playerName = "";

let scoreCounter = 0;
let highScores = [];
let score = 0;
let tries = 3;
let level = 1;

let gameTitle = null;
let gameOverText = null;
let gameTitleIndex = 0;
let gameOverTextIndex = 0;

let asteroidSize = 80;
let asteroidCount = 8;

let start = false;

let inputName = document.getElementById("input_name");

function setup(){
	WIDTH = document.body.offsetWidth;
	HEIGHT = window.innerHeight - 10;
	
	aliens = [];
	lasers = [];
	asteroids = [];
	particles = [];
	
	scoreCounter = 0;
	score = 0;
	tries = 3;
	level = 1;

	highScores[0] = 10000;
	highScores[1] = 1000;
	highScores[2] = 100;
	
	ship = new Ship(10);
	newLoop(0, asteroidCount, _ => asteroids.push(new Asteroid(asteroidSize)));

	gameTitle = new NewText(new Vector(WIDTH / 2, HEIGHT / 2 - 50), "ASTEROIDS REMAKE", CENTER, "spaceranger3d", 50);
	gameOverText = new NewText(new Vector(WIDTH / 2, HEIGHT / 2), "GAMEOVER", CENTER, "spaceranger3d", 48);
	gameTitleIndex = floor(random(5));
	gameOverTextIndex = -1;
	
	spawnAlien();
}

function controls() {
	//console.log(keyboard.key);
	if (keyboard.keys[32]) {
		if (!ship.invulnerable) ship.shoot();
	} else {
		ship.canShoot = true;
		if (keyboard.keys[37]) {
			ship.turn(-0.1);
		} else if (keyboard.keys[39]) {
			ship.turn(0.1);
		} else if (keyboard.keys[38]) {
			ship.boost();
		}
	}
}

function update() {

	if (inputName !== document.activeElement && inputName.value === "") inputName.value = "GUEST";
	let str = inputName.value;
	inputName.value = str.split(' ').join('');

	if (start && tries >= 0) {
		controls();

		ship.update();
		ship.targets([asteroids, aliens]);
		if (ship.destroyed) {
			ship = new Ship();
			tries--;
			if (tries < 0) gameOver();
		}

		asteroids.revereLoop((a, i) => {
			if (a.destroyed) {
				asteroids = asteroids.concat(a.breakup(2));
				asteroids.splice(i, 1);
			} else {
				checkPolygonCollision(ship, a, !ship.invulnerable).then(t => {
					a.destroyed = true;
					spawnParticles(t, 10);
					if (ship.buff == null || ship.buff.type !== Buff.types.shield) ship.destroyed = true;
				}).catch(err => console.log(err));
            }
		});

		aliens.revereLoop((a, i) => {
			a.targets([[ship], asteroids]);
			if (a.destroyed) {
				buffs.push(new Buff(a.pos, random( [Buff.types.health, Buff.types.shield] )));
				aliens.splice(i, 1);
			} else {
				checkPolygonCollision(ship, a, !ship.invulnerable).then(t => {
					a.destroyed = true;
					spawnParticles(t, 10);
					if (ship.buff == null || ship.buff.type !== Buff.types.shield) ship.destroyed = true;
				}).catch(err => console.log(err));
            }
		});

		buffs.revereLoop((b, i) => {
			checkPolygonCollision(ship, b).then(a => {
				if (b.type === Buff.types.health) tries += 1;
				else ship.buff = new Buff(b.pos, b.type, 500);
				b.destroyed = true;
				spawnParticles(a, 40, [.8, 1]);
			}).catch(err => console.log(err));
			if (b.destroyed) buffs.splice(i, 1);
		});
	}

	buffs.forEach(b => b.update());
	asteroids.forEach(a => a.update());
	aliens.forEach(a => a.update());

	particles.revereLoop((a, i) => {
		a.update();
		if (a.timer <= 0) particles.splice(i, 1);
	});

	if (asteroids.length <= 0) {
		newLoop(0, asteroidCount + floor(level / 5), i => asteroids.push(new Asteroid(asteroidSize + floor(level / 5))));
		level++;
	}
}

function render(){
	Background(0);
	canvas.style.cursor = "default";

	if (!start) {
		ctx.save();

		Fill(255);
		Alignment(CENTER);
		Translate(WIDTH/2, HEIGHT/2);

		Font(12);
		FillString(0, 0, "RANKS");

		let longestString = '';
		newLoop(0, document.getElementsByClassName('place').length, i => {
			let str = document.getElementsByClassName('place')[i].innerHTML;
			if (longestString.length < str.length) longestString = str;
		});

		Alignment(LEFT);
		newLoop(0, document.getElementsByClassName('place').length, i => {
			let str = document.getElementsByClassName('place')[i].innerHTML;
			if (str !== '') FillString(-ctx.measureText(longestString).width / 2, 20 * i + 20, (i + 1) + ' ' + str);
		});

		Alignment(CENTER);
		Font(32, "spaceranger3d");
		if (mouse.x > WIDTH / 2 - 50 && mouse.x < WIDTH / 2 + 50 && mouse.y > HEIGHT * .9 - 16 && mouse.y < HEIGHT * .9) {
			canvas.style.cursor = "pointer";
			Font(32, "spaceranger");
			if (mouse.clicked) {
				start = true;
				inputName.style.display = "none";
			}
		}
		inputName.style.width = (inputName.value.length + 1) + "em";
		inputName.style.left = ((WIDTH / 2) - (inputName.getBoundingClientRect().width / 2) + 10) + "px";
		inputName.style.top = (HEIGHT * .8) + "px";
		FillString(0, HEIGHT * .4, "PLAY");
		
		ctx.restore();
	}

	// Game Over Drawing
	if (start && tries < 0) {
		ctx.save();
		Fill(255);
		Alignment(CENTER);
		Translate(WIDTH / 2, HEIGHT / 2);

		gameOverTextIndex = gameOverTextIndex == -1 ? floor(random(asteroids.length)) : gameOverTextIndex;

		if (scoreCounter < score) {
			scoreCounter += 1 * floor(map(score - scoreCounter, score, 0, 10, score / 10)) + 1;
			if (mouse.clicked) scoreCounter = score;
		} else {
			scoreCounter = score;
			if (mouse.x > WIDTH / 2 - 50 && mouse.x < WIDTH / 2 + 50 && mouse.y > HEIGHT / 2 + 80 && mouse.y < HEIGHT / 2 + 104) {
				Stroke(100);
				Fill(100);
				canvas.style.cursor = "pointer";
				if (mouse.clicked) setup();
			} else {
				Stroke(255);
				Fill(255);
			}
			StrokeWidth(5);
			ctx.strokeRect(-50, 80, 100, 24);
			Font(8);
			FillString(0, 94, "TRY AGAIN");
		}
		Fill(255);
		Font(24);
		FillString(0, 40, scoreCounter);

		ctx.restore();
	}

	buffs.forEach(b => b.render());
	asteroids.forEach((a, i) => {
		if (i == gameTitleIndex && !start) gameTitle.render();
		if (i == gameOverTextIndex && start && tries < 0) gameOverText.render();
		a.render();
	});
	particles.forEach(a => a.render());
	aliens.forEach(a => a.render());


	// IN-GAME Drawing
	if(start && tries >= 0){
		ship.render();
		// Drawing UI
		Fill(255);
		Font(16);
		Alignment(LEFT);
		FillString(20, 20, "SCORE: "+score);

		// Drawing life
		newLoop(0, tries, i => {
			let s = new Ship(5);
			s.invulnerable = false;
			s.pos = new Vector(30 + (i * 20), 30);
			s.render();
		});
	}


	// Drawing Either Start or GameOver
	if (!start || tries < 0) {
		asteroids.forEach(a => {
			if (isInside(a.points, mouse)) {
				canvas.style.cursor = "pointer";
				a.color = 100;
			}
		});
		aliens.forEach(a => {
			if (isInside(a.points, mouse)) {
				canvas.style.cursor = "pointer";
				a.color = 100;
			}
		});
    }
}

function spawnAlien(){
	if (aliens.length >= floor(level/5) + 1)return;
	if (random() < .05)aliens.push(new Alien());
}

mouse.click = function(e){
	if(tries >= 0 && start)return;
	asteroids.revereLoop((a, i) => {
		if (isInside(a.points, mouse)) {
			asteroids = asteroids.concat(a.breakup(2));
			spawnParticles(new Vector(mouse.x, mouse.y), a.totalPoints);
			spawnAlien();
			asteroids.splice(i, 1);
		}
	});

	aliens.revereLoop((a, i) => {
		if (isInside(a.points, mouse)) {
			spawnParticles(new Vector(mouse.x, mouse.y), a.totalPoints);
			aliens.splice(i, 1);
		}
	});
}


function lookForRandomPos(r){
	let x = random(WIDTH);
	let y = random(HEIGHT);
	if(ship.pos.getDistance(x, y) < r * 6){
		return lookForRandomPos(r);
	}
	return new Vector(x, y);
}


function NewText(pos, text, align, font, size) {
	this.pos = pos;
	this.text = text;
	this.align = align || CENTER;
	this.font = font || "Arial";
	this.size = size || 12;
	if (align == CENTER || align == LEFT || align == BOTTOM || align == RIGHT || align == TOP) {
		this.align = align;
	} else {
		this.font = align;
    }

	this.render = function () {
		ctx.save();

		Fill(255);
		Font(this.size, this.font);
		Alignment(this.align);
		Translate(this.pos.x, this.pos.y);
		FillString(0, 0, this.text);

		ctx.restore();
    }
}

inputName.onkeypress = function (e) {
	if (e.keyCode === 32) return false;
}

function gameOver() {
	//SOCKET.emit('score', {
	//	name: inputName.value,
	//	score: score
	//});
	//document.getElementById("info").innerHTML = score;
	document.getElementById("info").dispatchEvent(new CustomEvent("gameover", {
		detail: {
			score: score	
		}
	});
}
