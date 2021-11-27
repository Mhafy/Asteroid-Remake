let WIDTH = 1024, HEIGHT = 640, LOADED = 0, LOOP = true;
let canvas = document.createElement('canvas');
let ctx = canvas.getContext("2d");
//let SOCKET = io.connect('http://localhost:3000');
let FONTS = [
	"spaceranger",
	"spaceranger3d",
	"spaceranger3dital",
	"spacerangeracad",
	"spacerangeracadital",
	"spacerangerbold",
	"spacerangerboldital",
	"spacerangercond",
	"spacerangercondital",
	"spacerangerexp",
	"spacerangerexpital",
	"spacerangerital",
	"spacerangerlas",
	"spacerangerlasital",
	"spacerangerleft"
];
let SPRITES = [];
let SCRIPTS = ['Vector', 'ship', 'alien', 'asteroid', 'laser', 'particles', 'buff', 'core'];
document.body.append(canvas);
document.body.onload = () => {
	ctx.imageSmoothingEnabled = false;
	ctx.webkitImageSmoothingEnabled = false;
	ctx.msImageSmoothingEnabled = false;
	if (typeof setup === 'function') { setup(); }
	loop();
};
async function loop(){
	let maxLoad = FONTS.length + SPRITES.length + SCRIPTS.length;
	if (LOADED == maxLoad) {
		if (typeof render === 'function') render();
		if (typeof update === 'function') update();
	}
	if (canvas.width !== WIDTH || canvas.height !== HEIGHT) {
		canvas.width = WIDTH;
		canvas.height = HEIGHT;
	}
	if (LOOP) requestAnimationFrame(loop);
};
FONTS.forEach(src => {
	let f = new FontFace(src, 'url(./res/fonts/' + src + '.ttf)');
	f.load().then(response => LOADED++).catch(() => console.error('Font not found "'+src+'.ttf"'));
	document.fonts.add(f);
	document.body.classList.add('fonts-loaded');
});
SPRITES.forEach(src => {
	let image = new Image();
	image.onload = () => LOADED++;
	image.onerror = () => console.error('File not Found "'+src+'.png"');
	image.src = "./res/part1/" + src + ".png";
});
SCRIPTS.forEach(src => {
	var script = document.createElement('script');
	script.onload = () => LOADED++;
	script.onerror = () => console.error('Script not Found "' + src + '.js"');
	script.src = 'script/' + src + '.js';
	script.async = true;
	document.getElementById("scripts").appendChild(script);
});
let noCanvas = () => document.body.removeChild(canvas);
let noLoop = () => LOOP = false;
let ColorString = (a, b, c, d) => "rgba(" + (a || 0) + "," + (b || a) + "," + (c || a) + "," + (d || b || 1) + ")";
let Fill = (a, b, c, d) => ctx.fillStyle = ColorString(a, b, c, d);
let Stroke = (a, b, c, d) => ctx.strokeStyle = ColorString(a, b, c, d);
let StrokeWidth = (a = 1) => ctx.strokeWidth = a;
let Background = (a, b, c, d) => {
	Fill(a, b, c, d);
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
}
let Translate = (x, y) => ctx.translate(x, y);
let Ellipse = (x, y, w, h) => {
	w = w || 1;
	h = h || w;
	x -= w / 2;
	y -= h / 2;
	var n = .5522848,
		ox = (w / 2) * n,
		oy = (h / 2) * n,
		xe = x + w,
		ye = y + h,
		xm = x + (w / 2),
		ym = y + (h / 2);
	ctx.beginPath();
	ctx.moveTo(x, ym);
	ctx.bezierCurveTo(x, ym - oy, xm - oy, y, xm, y);
	ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
	ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
	ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
}
let Line = (sx, sy, ex, ey) => {
	ctx.moveTo(sx, sy);
	ctx.lineTo(ex, ey);
}
let CENTER = "center", LEFT = "left", RIGHT = "right", TOP = "top", BOTTOM = "bottom";
let Font = (s = 1, f = "Arial") => ctx.font = s + "px " + f;
let Alignment = (a = "center") => ctx.textAlign = a + "";
function FillString(x, y, txt) {
	ctx.beginPath();
	ctx.fillText(txt, x, y);
	ctx.closePath();
}
function StrokeString(x, y, txt) {
	ctx.beginPath();
	ctx.strokeText(txt, x, y);
	ctx.closePath();
}


let PI = Math.PI;
var TWO_PI = PI * 2;
var HALF_PI = PI / 2;
let floor = (a) => Math.floor(a);
let round = (a) => Math.round(a);
let ceil = (a) => Math.ceil(a);
let cos = (a) => Math.cos(a);
let sin = (a) => Math.sin(a);
let radians = (a) => a * PI / 180;
let degrees = (a) => a * 180 / PI;
let random = (min, max) => {
	if (min !== undefined && Array.isArray(min)) return min[floor(random(min.length))];
	else {
		min = min || 1;
		max = max || 0;
		if (max > 0) return (Math.random() * (max - min)) + min;
		else return (Math.random() * min)
	}
};
let randomGaussian = (mean, sd) => {
	let y1, x1, x2, w, previous = false;
	if (previous) {
		y1 = y2;
		previous = false;
	} else {
		do {
			x1 = random(2) - 1;
			x2 = random(2) - 1; w = x1 * x1 + x2 * x2;
		} while (w >= 1);
		w = Math.sqrt(-2 * Math.log(w) / w);
		y1 = x1 * w;
		y2 = x2 * w;
		previous = true;
	}
	let m = mean || 0;
	let s = sd || 1;
	return y1 * s + m;
};
let constrain = (n, min, max) => Math.max(Math.min(n, max), min);
function map(n, start1, end1, start2, end2) {
	let newval = (n - start1) / (end1 - start1) * (end2 - start2) + start2;
	if (start2 < end2) return constrain(newval, start2, end2);
	return constrain(newval, end2, start2);
}
var mouse = { x: 0, y: 0, w: 1, h: 1, clicked: false, down: false };
mouse.click;
mouse.drag;
canvas.addEventListener("click", function (event) {
	mouse.clicked = true;
	if (typeof mouse.click == 'function') {
		mouse.click(event);
	}
}, false);
canvas.onmousemove = function (e) {
	mouse.x = e.offsetX;
	mouse.y = e.offsetY;
	if (mouse.down === true) {
		if (typeof mouse.drag == 'function') {
			mouse.drag(e);
		}
	}
	mouse.clicked = false;
};
canvas.onmousedown = function (e) {
	mouse.x = e.offsetX;
	mouse.y = e.offsetY;
	mouse.down = true;
}
canvas.onmouseup = function (e) {
	mouse.x = e.offsetX;
	mouse.y = e.offsetY;
	//mouse.clicked = false;
	mouse.down = false;
	errorReport = false;
};
let keyboard = {
	keys: [],
	key: -1,
	keyUp: function (e) {
		keyboard.key = e.keyCode;
		keyboard.keys[e.keyCode] = false;
	},
	keyDown: function (e) {
		keyboard.key = e.keyCode;
		keyboard.keys[e.keyCode] = true;
	}
};
window.addEventListener("keydown", keyboard.keyDown);
window.addEventListener("keyup", keyboard.keyUp);

function checkPolygonCollision(a, b, condition=true) {
	return new Promise((resolve, reject) => {
		if (typeof a === 'undefined' || typeof b === 'undefined') reject(new Error("Parameters are undefined"));
		else {
			let t = plygonCollision(a, b);
			if (t != null && condition) resolve(t);
        }
	});
}
let plygonCollision = (a, b) => {
	for (let s1 of a.sides) {
		for (let s2 of b.sides) {
			let x1 = s1[0].x;
			let y1 = s1[0].y;
			let x2 = s1[1].x;
			let y2 = s1[1].y;

			let x3 = s2[0].x;
			let y3 = s2[0].y;
			let x4 = s2[1].x;
			let y4 = s2[1].y;

			let den = ((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4));
			let t = (((x1 - x3) * (y3 - y4)) - ((y1 - y3) * (x3 - x4))) / den;
			let u = -(((x1 - x2) * (y1 - y3)) - ((y1 - y2) * (x1 - x3))) / den;

			if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
				return new Vector(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
			}
		}
	}
	return null;
};

let onSegment = (p, q, r) => (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y));
let orientation = (p, q, r) => {
	let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
	if (val == 0) return 0; // collinear
	return (val > 0) ? 1 : 2; // clock or counterclock wise
};
let doIntersect = (p1, q1, p2, q2) => {
	let o1 = orientation(p1, q1, p2),
		o2 = orientation(p1, q1, q2),
		o3 = orientation(p2, q2, p1),
		o4 = orientation(p2, q2, q1);
	if (o1 != o2 && o3 != o4) return true;
	if (o1 == 0 && onSegment(p1, p2, q1)) return true;
	if (o2 == 0 && onSegment(p1, q2, q1)) return true;
	if (o3 == 0 && onSegment(p2, p1, q2)) return true;
	if (o4 == 0 && onSegment(p2, q1, q2)) return true;
	return false;
};
let isInside = (polygon, p) => {
	n = polygon.length - 1;
	if (n < 3) return false;
	let extreme = new Vector(10000, p.y);
	let count = 0, i = 0;
	do {
		let next = (i + 1) % n;
		if (doIntersect(polygon[i], polygon[next], p, extreme)) {
			if (orientation(polygon[i], p, polygon[next]) == 0) return onSegment(polygon[i], p, polygon[next]);
			count++;
		}
		i = next;
	} while (i != 0);
	return (count % 2 == 1); // Same as (count%2 == 1)
};
function newLoop(s, m, func, i = 1) {
	for (let j = s; j < m; j += i)func(j);
}



// Array Object
Array.prototype.revereLoop = function (func) {
	for (let j = this.length - 1; j >= 0; j--) {
		func(this[j], j);
    }
}