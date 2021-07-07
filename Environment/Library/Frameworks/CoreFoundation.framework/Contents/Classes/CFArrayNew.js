// noinspection JSAnnotator
return class CFArray extends CFObject {
	static add(array, ...value) {
		if(!Object.isObject(array) || !Object.isKindOf(array, this) || !Array.isArray(array)) {
			throw new TypeError(0);
		}

		(array.add || array.push)(...value);
	}

	static contains(array, value) {
		if(!Object.isObject(array) || !Object.isKindOf(array, this) || !Array.isArray(array)) {
			throw new TypeError(0);
		}

		return (array.contains || array.includes)(value);
	}

	static remove(array, ...value) {
		if(!Object.isObject(array) || !Object.isKindOf(array, this) || !Array.isArray(array)) {
			throw new TypeError(0);
		}

		for(let v of value) {
			if(array.contains?.(v)) {
				array.remove(v);
			} else
			if(array.includes(v)) {
				array.splice(array.indexOf(v), 1);
			}
		}
	}

	__count = 0;
	__type;

	constructor(value) {
		super({});

		for(let k in this) {
			Object.defineProperty(this, k, {
				enumerable: false
			});
		}

		if(value) {
			if(Array.isArray(value) || Object.isObject(value) && Object.isKindOf(value, this)) {
				this.add(...value);
			} else
			if(Object.isObject(value)) {
				if(value.type) {
					if(typeof value.type !== 'function') {
						throw new TypeError(0);
					}

					this.__type = value.type;
				}
				if(value.with) {
					if(!Array.isArray(value.with)) {
						throw new TypeError(1);
					}

					this.add(...value.with);
				} else
				if(value.count) {
					if(!Number.isInteger(value.count)) {
						throw new TypeError(2);
					}

					for(let i = 0; i < value.count; i++) {
						this.add(value.repeating);
					}
				}
			}
		}
	}

	/**
	 * Количество элементов в массиве.
	 *
	 * @returns {number}
	 */
	get count() {
		return this.__count;
	}

	/**
	 * Логическое значение, указывающее, пуст ли массив.
	 *
	 * @returns {boolean}
	 */
	get empty() {
		return this.count === 0;
	}

	/**
	 * Позиция первого элемента в массиве.
	 *
	 * @returns {?number}
	 */
	get startIndex() {
		return !this.empty ? 0 : undefined;
	}

	/**
	 * Позиция последнего элемента в массиве.
	 *
	 * @returns {?number}
	 */
	get endIndex() {
		return !this.empty ? this.count-1 : undefined;
	}

	/**
	 * Количество элементов в массиве.
	 *
	 * @param {number} value
	 */
	set count(value) {
		if(!Number.isInteger(value))		throw new TypeError(0);
		if(value < 0 || value > this.count)	throw new RangeError(1);

		while(this.count > value) {
			this.removeLast();
		}
	}

	[Symbol.set](self, key, value) {
		if(typeof key !== 'number' && !key.isInteger()) {
			self[key] = value; return;
		} else {
			key = parseInt(key);
		}
		if(this.__type && !Object.isKindOf(value, this.__type)) {
			throw new TypeError(0);
		}

		let in_ = key in this;

		if(this.__shouldNotifyObservers) {
			for(let v of this.__observers || []) {
				v.function(in_ ? 'willChangeValueForIndex' : 'willAddIndex', key, value);
			}
		}
		if(key >= this.count) {
			self[this.count] = value;
			this.__count = this.__count+1;
		} else {
			self[key] = value;
		}
		if(this.__shouldNotifyObservers) {
			for(let v of this.__observers || []) {
				v.function(in_ ? 'didChangeValueForIndex' : 'didAddIndex', key, value);
			}
		}

		CFEvent.dispatch(undefined, _title+'Notification', { object: this, event: in_ ? 'changed' : 'added', key: key });
	}

	[Symbol.delete](self, key) {
		if(!(key in this)) {
			return;
		}

		let value = this[key]

		if(typeof key !== 'number' && !key.isInteger()) {
			delete self[key]

			if(Object.isObject(value) && value !== this) {
				value.release?.();
			}

			return;
		} else {
			key = parseInt(key);
		}

		if(this.__shouldNotifyObservers) {
			for(let v of this.__observers || []) {
				v.function('willRemoveIndex', key, value);
			}
		}

		delete self[key]

		if(Object.isObject(value) && value !== this) {
			value.release?.();
		}

		let snoBackup = this.__shouldNotifyObservers;

		this.__shouldNotifyObservers = false;
		for(let k in this) {
			if(k >= key) {
				this[k-1] = this[k]
			}
		}
		delete self[this.count-1]
		this.__count = this.__count-1;
		this.__shouldNotifyObservers = snoBackup;

		if(this.__shouldNotifyObservers) {
			for(let v of this.__observers || []) {
				v.function('didRemoveIndex', key, value);
			}
		}

		CFEvent.dispatch(undefined, _title+'Notification', { object: this, event: 'removed', key: key });
	}

	[Symbol.iterator]() {
		let done,
			value,
			k = 0;

		return {
			next: () => {
				if(k < this.count) {
					done = false;
					value = this[k]
					k = k+1;
				} else {
					done = true;
				}

				return {
					done: done,
					value: value
				}
			}
		}
	}

	/**
	 * Добавляет новый элемент в конец массива.
	 *
	 * @param {*} values
	 */
	add(...values) {
		if(values.length === 1) {
			this[this.count] = values[0]
		}
		if(values.length > 1) {
			let indexes = new Array(values.length).fill().map((v, k) => this.count+k);

			this.__shouldNotifyObservers = false;

			for(let v of this.__observers || []) {
				v.function('willAdd', indexes, values);
			}
			for(let v of values) {
				this[this.count] = v;
			}
			for(let v of this.__observers || []) {
				v.function('didAdd', indexes, values);
			}

			this.__shouldNotifyObservers = true;
		}
	}

	/**
	 * Вставляет новый элемент или элементы массива в указанную позицию.
	 *
	 * @param {Object}	object
	 * @param {?*}		object.element		Элемент
	 * @param {?*[]}	object.contentsOf	Массив элементов
	 * @param {number}	object.at			Позиция
	 */
	insert({ element, contentsOf, at } = {}) {
		if(contentsOf && !Array.isArray(contentsOf) && !Object.isKindOf(contentsOf, CFArray)) {
			throw new TypeError(0);
		}

		let left = new Array(at).fill().map((v, k) => this[k]),
			middle = contentsOf ?? [element],
			right = new Array(this.count-at).fill().map((v, k) => this[at+k]),
			sum = [...left, ...middle, ...right],
			indexes = new Array(middle.length).fill().map((v, k) => at+k);

		this.__shouldNotifyObservers = false;

		for(let v of this.__observers || []) {
			if(!contentsOf) {
				v.function('willInsertIndex', at, element);
			} else {
				v.function('willInsert', indexes, contentsOf);
			}
		}
		for(let k in sum) {
			this[k] = sum[k]
		}
		for(let v of this.__observers || []) {
			if(!contentsOf) {
				v.function('didInsertIndex', at, element);
			} else {
				v.function('didInsert', indexes, contentsOf);
			}
		}

		this.__shouldNotifyObservers = true;
	}

	/**
	 * Возвращает первый элемент массива, удовлетворяющий заданному предикату.
	 *
	 * @param	{Function} function_
	 * @returns	{*}
	 */
	first(function_) {
		if(typeof function_ !== 'function') {
			throw new TypeError(0);
		}

		for(let v of this) {
			if(function_(v)) {
				return v;
			}
		}
	}

	firstIndex({ of, where } = {}) {
		if(where && typeof where !== 'function') {
			throw new TypeError(0);
		}

		for(let k = 0; k < this.count; k++) {
			if(!where ? this[k] === of : where(this[k])) {
				return k;
			}
		}
	}

	/**
	 * Возвращает последний элемент массива, удовлетворяющий заданному предикату.
	 *
	 * @param	{Function} function_
	 * @returns	{*}
	 */
	last(function_) {
		if(typeof function_ !== 'function') {
			throw new TypeError(0);
		}

		for(let k = this.count-1; k > -1; k--) {
			if(function_(this[k])) {
				return this[k]
			}
		}
	}

	lastIndex({ of, where } = {}) {
		if(where && typeof where !== 'function') {
			throw new TypeError(0);
		}

		for(let k = this.count-1; k > -1; k--) {
			if(!where ? this[k] === of : where(this[k])) {
				return k;
			}
		}
	}

	/**
	 * Возвращает массив, содержащий результаты сопоставления заданной функции с элементами последовательности.
	 *
	 * @param	{Function} function_
	 * @returns	{CFArray}
	 */
	map(function_) {
		if(typeof function_ !== 'function') {
			throw new TypeError(0);
		}

		let map = []

		for(let v of this) {
			map.push(function_(v));
		}

		return new this.constructor(map);
	}

	/**
	 * Возвращает массив, содержащий элементы, удовлетворяющие заданному предикату.
	 *
	 * @param	{Function} function_
	 * @returns	{CFArray}
	 */
	filter(function_) {
		if(typeof function_ !== 'function') {
			throw new TypeError(0);
		}

		let filter = []

		for(let v of this) {
			if(function_(v)) {
				filter.push(v);
			}
		}

		return new this.constructor(filter);
	}

	/**
	 * Возвращает логическое значение, указывающее, удовлетворяет ли каждый элемент массива заданному предикату.
	 *
	 * @param	{Function} function_
	 * @returns	{boolean}
	 */
	allSatisfy(function_) {
		if(typeof function_ !== 'function') {
			throw new TypeError(0);
		}

		for(let v of this) {
			if(!function_(v)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Возвращает логическое значение, указывающее, содержит ли массив данный элемент.
	 *
	 * @param	{*} value
	 * @returns	{boolean}
	 */
	contains(value) {
		return this.firstIndex({ of: value }) !== undefined;
	}

	/**
	 * Возвращает минимальный элемент в массиве.
	 *
	 * @returns {*}
	 */
	min() {
		let min;

		for(let v of this) {
			min = min === undefined ? v : v < min ? v : min;
		}

		return min;
	}

	/**
	 * Возвращает максимальный элемент в массиве.
	 *
	 * @returns {*}
	 */
	max() {
		let max;

		for(let v of this) {
			max = max === undefined ? v : v > max ? v : max;
		}

		return max;
	}

	/**
	 * Удаляет первое вхождение заданного элемента из массива.
	 *
	 * @param {*} values
	 */
	remove(...values) {
		let indexes = []

		for(let v of values) {
			if(this.contains(v)) {
				indexes.push(this.firstIndex({ of: v }));
			}
		}

		if(indexes.length === 1) {
			delete this[indexes[0]]
		}
		if(indexes.length > 1) {
			this.__shouldNotifyObservers = false;

			for(let v of this.__observers || []) {
				v.function('willRemove', indexes, values);
			}
			for(let k of [...indexes].reverse()) {
				delete this[k]
			}
			for(let v of this.__observers || []) {
				v.function('didRemove', indexes, values);
			}

			this.__shouldNotifyObservers = true;
		}
	}

	/**
	 * Удаляет и возвращает первый элемент, либо удаляет указанное количество элементов из начала массива.
	 *
	 * @param	{number} times
	 * @returns	{?*}
	 */
	removeFirst(times = 1) {
		if(!Number.isInteger(times))		throw new TypeError(0);
		if(times < 0 || times > this.count)	throw new RangeError(1);
		if(this.count < 1)					return;

		let value = times === 1 ? this[0] : undefined;

		for(let i = 0; i < times; i++) {
			delete this[0]
		}

		return value;
	}

	/**
	 * Удаляет и возвращает последний элемент, либо удаляет указанное количество элементов из конца массива.
	 *
	 * @param	{number} times
	 * @returns	{?*}
	 */
	removeLast(times = 1) {
		if(!Number.isInteger(times))		throw new TypeError(0);
		if(times < 0 || times > this.count)	throw new RangeError(1);
		if(this.count < 1)					return;

		let value = times === 1 ? this[this.count-1] : undefined;

		for(let i = 0; i < times; i++) {
			delete this[this.count-1]
		}

		return value;
	}

	/**
	 * Удаляет либо все элементы из массива, либо удовлетворяющие заданному предикату.
	 *
	 * @param {Object}		object
	 * @param {Function}	object.where		Предикат.
	 * @param {boolean}		object.keepCount	Сохранение количества элементов с очисткой позиций.
	 */
	removeAll({ where, keepCount = false } = {}) {
		if(where && typeof where !== 'function')	throw new TypeError(0);
		if(typeof keepCount !== 'boolean')			throw new TypeError(1);

		if(!keepCount) {
			if(!where) {
				this.count = 0;
			} else {
				for(let k = this.count-1; k > -1; k--) {
					if(where(this[k])) {
						delete this[k]
					}
				}
			}
		} else {
			for(let k = 0; k < this.count; k++) {
				if(!where || where && where(this[k])) {
					let value = this[k]

					this[k] = undefined;

					if(Object.isObject(value) && value !== this) {
						value.release?.();
					}
				}
			}
		}
	}

	release(forced = false) {
		if(!forced && this.__retained) {
			this.__retained = false; return;
		}

		this.remove(...this);

		super.release();
	}

	destructor() {
		this.removeAll({ where: () => true });

		super.destructor();
	}
}