window.Object.isObject = (value) => {
	return typeof value === 'object' && value !== null;
}
window.Object.isShallowlyEqual = (object, object_) => {
	if(Object.keys(object).length !== Object.keys(object_).length) {
		return false;
	}

	for(let k in object) {
		if(object[k] !== object_[k]) {
			return false;
		}
	}

	return true;
}
window.Object.instanceOf = function(object, object_) {
	let proto = object.__proto__;

	while(proto) {
		if(proto.constructor && proto.constructor == object_ || proto == Object.getPrototypeOf(object_)) {
			return true;
		}
		if(proto.__proto__) {
			proto = proto.__proto__;
		} else {
			break;
		}
	}

	return false;
}

let arrayMethods = {
	startsWith: {
		value: function(value) {
			for(let k in value) {
				if(this[k] !== value[k]) {
					return false;
				}
			}

			return true;
		},
		enumerable: false,
		writable: true
	},
	shallowlyContains: {
		value: function(value) {
			if(Object.isObject(value)) {
				return this.filter(v => Object.isShallowlyEqual(v, value)).length > 0;
			} else {
				return this.includes(value);
			}
		},
		enumerable: false,
		writable: true
	}
}

Object.defineProperties(window.Array.prototype, arrayMethods);
Object.defineProperties(window.Buffer.prototype, arrayMethods);

window.Number.prototype.toHexString = (n) => {
	return '0x'+(n+0x10000).toString(16).substr(-4).toUpperCase();
}
window.Math.isEven = (n) => {
	return n % 2 == 0;
}
window.Math.isOdd = (n) => {
	return Math.abs(n % 2) == 1;
}
window.Math.randomArbitrary = (min, max) => {
	return Math.random()*(max-min)+min;
}
window.Math.randomInt = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);

	return Math.floor(Math.random()*(max-min))+min;
}
window.Math.randomIntInclusive = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);

	return Math.floor(Math.random()*(max-min+1))+min;
}
window.nil = undefined;
window.YES = true;
window.NO = false;