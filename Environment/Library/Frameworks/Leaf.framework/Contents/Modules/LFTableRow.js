return class extends LFControl {
	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			title: 'TableRow',
			data: {},
			..._
		}
		this.title = this.title;
		this.action = this.action;
	}

	get title() {
		return this._.title;
	}

	get state() {
		return this.attributes['activated'] == '' ? true : false;
	}

	get data() {
		return this._.data;
	}

	set title(_value) {
		this._.title = _value;
		this.attributes['title'] = _value;
	}

	set state(_value) {
		return {
			true: () => {
				this.attributes['activated'] = '';
				for(let v of this.get('Siblings', this.class)) {
					v.state = false;
				}
			},
			false: () => {
				this.attributes['activated'] = undefined;
			}
		}[_value]();
	}

	set data(_value) {
		this._.data = _value;
	}

	click() {}

	dblclick() {
		if(this.action) {
			this.action();
		}
	}

	mouseleave() {
		this.attributes['highlighted'] = undefined;
	}

	mouseup() {}
}