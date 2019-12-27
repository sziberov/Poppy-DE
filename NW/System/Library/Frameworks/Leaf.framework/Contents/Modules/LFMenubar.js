return class extends LFView {
	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			transparent: false,
			..._
		}

		this.attributes['transparent'] = this._.transparent == true ? '' : undefined;
		this.subviews = [
			new LFButton({ title: '', image: new LFImage({ shared: 'TemplateLogo' }), action: () => _PoppyMenu.state = true }),
			new LFMenubarGroup({ type: 'application' }),
			new LFMenubarGroup({ type: 'status', subviews: [
				new LFButton({ title: '', image: new LFImage({ shared: 'TemplateNotifications' }), action: () => alert('HUHU') }),
				new LFButton({ title: '', image: new LFImage({ shared: 'TemplateSearch' }) }),
				new LFButton({ title: 'DIES', action: function() { this.title = 'Random Title' } }),
				new LFButton({ title: '20:48', action: function() {
					var update = () => {
						let _date = new Date(),
							_time = _date.getHours()+':'+_date.getMinutes();

						this.title = _time;
					}
					update();
					setInterval(update, 30000);
				} }),
				new LFButton({ title: '', image: new LFImage({ width: 24, shared: 'TemplateBatteryConnected' }) })
			] })
		]
	}

	set transparent(_value) {
		this._.transparent = _value;
		this.attributes['transparent'] = _value == true ? '' : undefined;
	}

	setGroup(_type, _subviews) {
		var _group = this.subviews.filter(v => v.class == 'LFMenubarGroup' && v.attributes[_type.toLowerCase()] == '');

		if(_group.length > 0) _group[0].setSubviews(_subviews);
		
		return this;
	}

	getGroup(_type) {
		return this.subviews.filter(v => v.class == 'LFMenubarGroup' && v.attributes[_type.toLowerCase()] == '');
	}
}