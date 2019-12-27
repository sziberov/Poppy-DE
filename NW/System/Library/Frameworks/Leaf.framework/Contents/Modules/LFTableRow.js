return class extends LFView {
	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			title: 'TableRow',
			data: {},
			action: undefined,
			..._
		}

		this.attributes['title'] = this._.title;
		this.events = {
			dblclick: this._.action,
			mousedown: (_event) => {
				_event.stopPropagation();
				this.state = true;
				this.get('Superview', 'LFWindow').focus();
			}
		}

		this.data = this._.data;
		this.active = false;
	}

	set state(_value) {
		return {
			true: () => {
				for(var v of this.get('Siblings', this.class)) v.state = false;
				this.active = true;
				if(this.element) this.element.attr('active', '');
			},
			false: () => {
				this.active = false;
				if(this.element) this.element.removeAttr('active');
			}
		}[_value]();
	}
}