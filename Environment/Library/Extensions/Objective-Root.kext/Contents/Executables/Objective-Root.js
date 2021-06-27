/*
	Objective-Root v0.1:
		Расширения для JS. Здесь находится часть, не нуждающаяся в методах ядра - та же в свою очередь содержится непосредственно в ядре.
*/

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

let isClassOf = function(value, value_, strict) {
	if(
		!Object.isObject(value) && typeof value !== 'function' ||
		!Object.isObject(value_) && typeof value_ !== 'function' ||
		strict && typeof strict !== 'boolean'
	) {
	//	throw new TypeError();
		return false;
	}

	if(Object.isObject(value_)) {
		if(typeof value_.__proto__?.constructor === 'function') {
			value_ = value_.__proto__.constructor;
		} else {
			return false;
		}
	}

	let toString = Function.prototype.toString,	// (class {}).toString
		proto = value;

	while(true) {
		value = proto;

		if(Object.isObject(value)) {
			if(typeof value.__proto__?.constructor === 'function') {
				value = value.__proto__.constructor;
			} else {
				return false;
			}
		}

		if(value === value_ || toString.call(value) === toString.call(value_)) {
			return true;
		}

		if(strict) {
			break;
		}
		if(proto.__proto__ && proto.__proto__ !== Object.__proto__) {
			proto = proto.__proto__;
		} else {
			break;
		}
	}

	return false;
}

window.Object.isMemberOf = function(value, value_) {
	return isClassOf(value, value_, true);
}

window.Object.isKindOf = function(value, value_) {
	return isClassOf(value, value_);
}

window.Object.sizeOf = function(object) {
	let objects = [],
		stack = [object],
		bytes = 0;

	while(stack.length) {
		let value = stack.pop();

		if(typeof value === 'boolean') {
			bytes += 4;
		} else
		if(typeof value === 'string') {
			bytes += value.length*2;
		} else
		if(typeof value === 'number') {
			bytes += 8;
		} else
		if(typeof value === 'object' && objects.indexOf(value) === -1) {
			objects.push(value);

			for(let i in value) {
				stack.push(value[i]);
			}
		}
	}

	return bytes;
}

window.Object.__set = function(object, key, value, super_) {
	if(!Object.isObject(object) && typeof object !== 'function') {
		return;
	}
	if(super_) {
		object = Object.getPrototypeOf(object);
	}

	if(typeof object.__set === 'function') {
		return object.__set(key, value);
	} else {
		let oldValue = object[key]

		object[key] = value;

		if(oldValue !== value) {
			Object.__unreferenced(oldValue);
			Object.__referenced(value);
		}

		return value;
	}
}

window.Object.__referenced = function(value) {
	if(Object.isObject(value) && typeof value.__referenceCount === 'number') {
		Object.__set(value, '__referenceCount', value.__referenceCount+1);
	}

	return value;
}

window.Object.__unreferenced = function(value) {
	if(Object.isObject(value) && typeof value.__referenceCount === 'number') {
		Object.__set(value, '__referenceCount', value.__referenceCount-1);
	}

	return undefined;
}

let arrayFields = {
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
	},
	initialize: {
		value: function(value) {
			if(this.length < 1) {
				this.push(value);
			}

			return this;
		},
		enumerable: false,
		writable: true
	}
}

Object.defineProperties(window.Array.prototype, arrayFields);
Object.defineProperties(window.Buffer.prototype, arrayFields);

window.Number.prototype.toHexString = (n) => {
	return '0x'+(n+0x10000).toString(16).substr(-4).toUpperCase();
}

window.Math.isEven = (n) => {
	return n%2 === 0;
}

window.Math.isOdd = (n) => {
	return Math.abs(n%2) === 1;
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