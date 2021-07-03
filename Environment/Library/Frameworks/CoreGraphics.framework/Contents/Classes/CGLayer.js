// noinspection JSAnnotator
return $CFShared[_title] || class CGLayer {
	static __friends__ = [CGContext, CGImage, CGSWindowServer]

	__layer = _call('drCreate', 0, 0);
	__context = new CGContext(this);
	__sublayers = new CFArray();
	__x;
	__y;
	__backgroundFilters = new CFArray();
	__mask;
	__hidden;

	constructor({ x = 0, y = 0, width = 0, height = 0 } = {}) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	get context() {
		return this.__context;
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

	get mask() {
		return this.__mask;
	}

	get hidden() {
		return this.__hidden;
	}

	set sublayers(value) {
		if(value && !Array.isArray(value)) {
			throw new TypeError(0);
		}

		this.__sublayers.removeAll();
		if(value) {
			this.__sublayers.add(...value.filter(v => v));
		}
	}

	set x(value) {
		if(typeof value !== 'number') {
			throw new TypeError(0);
		}

		this.__x = value;
	}

	set y(value) {
		if(typeof value !== 'number') {
			throw new TypeError(0);
		}

		this.__y = value;
	}

	set width(value) {
		if(typeof value !== 'number')	throw new TypeError(0);
		if(value < 0)					throw new RangeError(1);

		this.__layer.width = value;
	}

	set height(value) {
		if(typeof value !== 'number')	throw new TypeError(0);
		if(value < 0)					throw new RangeError(1);

		this.__layer.height = value;
	}

	set backgroundFilters(value) {
		if(value && !Array.isArray(value)) {
			throw new TypeError(0);
		}

		this.__backgroundFilters.removeAll();
		if(value) {
			this.__backgroundFilters.add(...value.filter(v => v));
		}
	}

	set mask(value) {
		if(!Object.isKindOf(value, this)) {
			throw new TypeError(0);
		}

		this.__mask = value;
	}

	set hidden(value) {
		if(typeof value !== 'boolean') {
			throw new TypeError(0);
		}

		this.__hidden = value;
	}

	draw() {
		let layer = new CGLayer({ x: this.x, y: this.y, width: this.width, height: this.height });

		layer.context.drawLayer(this, 0, 0);
		for(let v of this.sublayers) {
			if(v.hidden) {
				continue;
			}
			for(let v_ of v.backgroundFilters) {
				if(v_.title === 'blur') {
					layer.context.blur(v_.amount, true, true, v_.mask ?? v, v_.mask ? v.x+v_.mask.x : v.x, v_.mask ? v.y+v_.mask.y : v.y);
				}
			}
			layer.context.drawLayer(v.draw());
		}
		if(this.mask) {
			layer.context.mask(this.mask, true);
		}

		return layer;
	}
}