// noinspection JSAnnotator
return class CGRectangle {
	__point;
	__size;

	constructor(point = new CGPoint(), size = new CGSize()) {
		if(arguments.length === 4) {
			point = new CGPoint(arguments[0], arguments[1]);
			size = new CGSize(arguments[2], arguments[3]);
		}

		this.point = point;
		this.size = size;
	}

	get point() {
		return this.__point;
	}

	get size() {
		return this.__size;
	}

	get standardized() {
		return this.point.x < 0 || this.point.y < 0 || this.size.width < 0 || this.size.height < 0 ? new this.constructor(this.point.standardized, this.size.standardized) : this;
	}

	set point(value) {
		if(!Object.isKindOf(value, CGPoint)) {
			throw new TypeError(0);
		}

		this.__point = value;
	}

	set size(value) {
		if(!Object.isKindOf(value, CGSize)) {
			throw new TypeError(0);
		}

		this.__size = value;
	}
}