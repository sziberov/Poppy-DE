return _fork('@Title') || _single(class extends LFView {
	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			transparent: false,
			..._
		}

		this.attributes['transparent'] = this._.transparent == true ? '' : undefined;
		this.subviews.add(
			new LFButton({ title: '', image: new LFImage({ shared: 'TemplateLogo' }), action: function() { _PoppyMenu.setState('Toggle', this) } }),
			new LFMenu({ tag: 'application', autoactivatesItems: false }),
		//	new LFMenu({ tag: 'status', autoactivatesItems: false }),
			new LFMenubarGroup({ type: 'status', subviews: [
				new LFButton({ title: '', image: new LFImage({ shared: 'TemplateNotifications' }), action: () => alert('HUHU') }),
				new LFButton({ title: '', image: new LFImage({ shared: 'TemplateSearch' }) }),
				new LFButton({ title: 'DIES', action: function() { this.title = 'Random Title' } }),
				new LFButton({ title: '20:48', action: function() {
					let update = () => {
						let _date = new Date(),
							_time = ('0'+_date.getHours()).substr(-2)+':'+('0'+_date.getMinutes()).substr(-2);

						this.title = _time;
					}
					update();
					setInterval(update, 30000);
				} }),
				new LFButton({ title: '', image: new LFImage({ width: 24, shared: 'TemplateBatteryConnected' }),
					menu: new LFMenu({ items: [
						new LFMenuItem({ title: '100% Remaining' }),
						new LFMenuItem({ title: 'Power Source: Charger' }),
						new LFMenuItem().separator(),
						new LFMenuItem({ title: 'Energy Saver Preferences...', action: () => new LFWorkspace().launchApplication('/Applications/Environment Preferences') })
					] })
				})
			] })
		);
	}

	get transparent() {
		return this._.transparent;
	}

	get applicationMenu() {
		return this.subviews.filter(v => v.tag == 'application')[0]
	}

	get statusMenu() {
		return this.subviews.filter(v => v.tag == 'status')[0]
	}

	get statusGroup() {
		return this.subviews.filter(v => v.class == 'LFMenubarGroup' && v.type == 'status')[0]
	}

	set transparent(_value) {
		this._.transparent = _value;
		this.attributes['transparent'] = _value == true ? '' : undefined;
	}
});