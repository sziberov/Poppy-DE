// Тип, обозначающий размеры.
//
// noinspection JSAnnotator
return class CGSize extends CFObject {
	__width;
	__height;

	constructor({ width = 0, height = 0 } = {}) {
		super();

		this.width = width;
		this.height = height;
	}

	get width() {
		return this.__width;
	}

	get height() {
		return this.__height;
	}

	get standardized() {
		return this.width < 0 || this.height < 0 ? new this.constructor({ width: Math.abs(this.width), height: Math.abs(this.height) }) : this;
	}

	set width(value) {
		if(typeof value !== 'number') {
			throw new TypeError(0);
		}

		this.__width = value;
	}

	set height(value) {
		if(typeof value !== 'number') {
			throw new TypeError(0);
		}

		this.__height = value;
	}
}