return class extends LFControl {
	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			type: '',
			..._
		}

		this.attributes[this._.type] = ['close', 'miniaturize', 'zoom'].includes(this._.type) ? '' : undefined;
		/*
		this.events.mouseover = (_event) => {
			_event.stopPropagation();
			if(typeof this.events.click === 'function') {
				this.element.attr('hover', '');
				for(var v of this.get('Siblings', this.class)) v.element.attr('hover', '');
				this.element.one('mouseout', () => {
					this.element.removeAttr('hover');
					for(var v of this.get('Siblings', this.class)) v.element.removeAttr('hover');
				});
			}
		}
		*/
	}
}