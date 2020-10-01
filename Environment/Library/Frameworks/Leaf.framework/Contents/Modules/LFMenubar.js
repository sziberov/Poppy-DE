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
		this.subviews = [
			new LFButton({ title: '', image: new LFImage({ shared: 'TemplateLogo' }), action: function() { _PoppyMenu.setState('Toggle', this) } }),
			new LFMenubarGroup({ type: 'application' }),
			/*
			new LFMenu({ items: [
				new LFMenuItem({ title: 'File' }),
				new LFMenuItem({ title: 'Edit' }),
				new LFMenuItem({ title: 'View',
					menu: new LFMenu({ items: [
						new LFMenuItem({ title: 'Toggle Menubar Transparency', action: () => {
							var a = new LFMenubar().transparent;

							new LFMenubar().transparent = !a;
						} })
					] })
				})
			] }),
			*/
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
		]
	}

	get transparent() {
		return this._.transparent;
	}

	set transparent(_value) {
		this._.transparent = _value;
		this.attributes['transparent'] = _value == true ? '' : undefined;
	}

	getGroup(_type) {
		return this.subviews.filter(v => v.class == 'LFMenubarGroup' && v.attributes[_type.toLowerCase()] == '')[0]
	}

	setGroup(_type, _subviews, _application) {
		let _group = this.subviews.filter(v => v.class == 'LFMenubarGroup' && v.type == _type.toLowerCase())[0]

		if(_group) {
			_group.setSubviews(_subviews);
			if(_type == 'Application') {
				_group.application =  _application;
			}
		}

		return this;
	}
});