// Тип, обозначающий точку в двумерной системе координат.
//
// noinspection JSAnnotator
return class CGPoint {
	__x;
	__y;

	constructor({ x = 0, y = 0 } = {}) {
		this.x = x;
		this.y = y;
	}

	get x() {
		return this.__x;
	}

	get y() {
		return this.__y;
	}

	get standardized() {
		return this.x < 0 || this.y < 0 ? new this.constructor({ x: Math.abs(this.x), y: Math.abs(this.y) }) : this;
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
}