// noinspection JSAnnotator
return $CFShared[_title] || class {
	static __friends__ = [this, CGWindowServer, CGImage]

	__layer = _request('drCreate', 0, 0);
	__sublayers = new CFArray();
	__x;
	__y;
	__backgroundFilters = new CFArray();
	__hidden;

	constructor({ x = 0, y = 0, width = 0, height = 0 } = {}) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	get __context() {
		return this.__layer.context2d;
	}

	get sublayers() {
		return this.__sublayers;
	}

	get x() {
		return this.__x;
	}

	get y() {
		return this.__y;
	}

	get width() {
		return this.__layer.width;
	}

	get height() {
		return this.__layer.height;
	}

	get backgroundFilters() {
		return this.__backgroundFilters;
	}

	get hidden() {
		return this.__layer.hidden;
	}

	set sublayers(value) {
		if(value && !Array.isArray(value)) {
			throw new TypeError();
		}

		this.__sublayers.removeAll();
		if(value) {
			this.__sublayers.add(...value.filter(v => v));
		}
	}

	set x(value) {
		if(typeof value !== 'number') {
			throw new TypeError();
		}

		this.__x = value;
	}

	set y(value) {
		if(typeof value !== 'number') {
			throw new TypeError();
		}

		this.__y = value;
	}

	set width(value) {
		if(typeof value !== 'number')	throw new TypeError();
		if(value < 0)					throw new RangeError();

		this.__layer.width = value;
	}

	set height(value) {
		if(typeof value !== 'number')	throw new TypeError();
		if(value < 0)					throw new RangeError();

		this.__layer.height = value;
	}

	set backgroundFilters(value) {
		if(value && !Array.isArray(value)) {
			throw new TypeError();
		}

		this.__backgroundFilters.removeAll();
		if(value) {
			this.__backgroundFilters.add(...value.filter(v => v));
		}
	}

	set hidden(value) {
		if(typeof value !== 'boolean') {
			throw new TypeError();
		}

		this.__hidden = value;
	}

	draw() {
		let layer = new CGLayer({ x: this.x, y: this.y, width: this.width, height: this.height });

		layer.drawLayer(this, 0, 0);
		for(let v of this.__sublayers) {
			if(v.hidden) {
				continue;
			}
			for(let v_ of v.__backgroundFilters) {
				if(v_.title === 'blur') {
					layer.blur(v_.amount, true, true, v_.mask ?? v, v_.mask ? v.x+v_.mask.x : v.x, v_.mask ? v.y+v_.mask.y : v.y);
				}
			}
			layer.drawLayer(v.draw());
		}

		return layer;
	}

	drawRectangle(color, x, y, width, height) {
		_request('drDraw', this.__layer, 'rectangle', color, x, y, width, height);
	}

	drawGradient(colors, x, y, width, height, fromX, fromY, toX, toY) {
		_request('drDraw', this.__layer, 'gradient', colors, x, y, width, height, fromX, fromY, toX, toY);
	}

	drawLayer(layer, x, y, width, height) {
		_request('drDraw', this.__layer, 'layer', layer.__layer, x ?? layer.x, y ?? layer.y, width, height);
	}

	clip(x, y, width, height) {
		_request('drClip', this.__layer, x, y, width, height);
	}

	blur(amount, sharp, apply, layer, x, y, ...arguments_) {
		_request('drBlur', this.__layer, amount, sharp, apply, layer.__layer, x ?? layer.x, y ?? layer.y, ...arguments_);
	}

	move(type, x, y, width, height, layer, x_, y_) {
		_request('drMove', this.__layer, type, x, y, width, height, layer.__layer, x_, y_);
	}

	mask(layer, apply, x, y, ...arguments_) {
		_request('drMask', this.__layer, layer.__layer, apply, x ?? layer.x, y ?? layer.y, ...arguments_);
	}

	clear(x, y, width, height) {
		_request('drClear', this.__layer, x, y, width, height);
	}

	iterate(function_) {
		_request('drIterate', this.__layer, function_);
	}
}