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

	get activated() {
		return this.attributes['activated'] == '' ? true : false;
	}

	get data() {
		return this._.data;
	}

	set title(value) {
		this._.title = value;
		this.attributes['title'] = value;
	}

	set activated(value) {
		return {
			true: () => {
				this.attributes['activated'] = '';
				for(let v of this.get('Siblings', this.class)) {
					v.activated = false;
				}
			},
			false: () => {
				this.attributes['activated'] = undefined;
			}
		}[value]();
	}

	set data(value) {
		this._.data = value;
	}

	click() {}

	dblclick() {
		if(this.action) {
			this.action();
		}
	}

	mouseleave() {
		this.highlighted = false;
	}

	mouseup() {}
}