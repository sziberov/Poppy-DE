return _fork('@Title') || _single(class extends LFView {
	#launchedApplications = new CFArray();

	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			desktopImage: '',
			..._
		}
		this.desktopImage = this.desktopImage;

		this.subviews.add(new LFMenubar({ transparent: true }));
		CFEventEmitter.addHandler('psListChanged', (a) => {
			if(a.event == 'removed') {
				let v = this.launchedApplications.filter(v => v.processIdentifier == a.value)[0],
					_focused = new LFMenubar().applicationMenu.application;

				this.launchedApplications.remove(v);

				new LFMenubar().applicationMenu.items = []
				new LFMenubar().applicationMenu.application = undefined;
				for(let vvv of this.subviews.filter(vv => vv.application == v)) {
					vvv.destroy();
				}

				let _default = this.getApplication('ru.poppy.enviro');

				if(_focused == v && _default) {
					_default.focus();
				} else
				if(_focused !== v) {
					_focused.focus();
				}
			}
		});
	}

	get launchedApplications() {
		return this.#launchedApplications;
	}

	get desktopImage() {
		return this._.desktopImage;
	}

	set desktopImage(_value) {
		this._.desktopImage = _value;
		this.style['background-image'] = 'url(\''+_value+'\')';
	}

	mousedown() {
		LFMenu.deactivateAll();
	}

	launchApplication(_url, ..._arguments) {
		_url = _url.endsWith('.app') ? _url : _url+='.app';

		try {
			var _bundle = new CFBundle(_url),
				_identifier = _bundle.properties.CFBundleIdentifier,
				_title = _bundle.properties.CFBundleTitle;
		} catch(_error) {
			new LFAlert({
				message: 'Application unable to load.',
				information: _error.name+': '+_error.message
			});

			throw _error;
		}

		if(!this.getApplication(_identifier)) {
			try {
				_request('exec', 'root', 'root', _bundle.executables+'/'+_bundle.properties.CFBundleExecutable+'.js', ..._arguments);

				return this.getApplication(_identifier);
			} catch(_error) {
				if(this.getApplication(_identifier)) {
					this.getApplication(_identifier).quit();
				}
				new LFAlert({
					message: `"${_title}" unable to launch.`,
					information: _error.name+': '+_error.message
				});

				throw _error;
			}
		} else {
			this.getApplication(_identifier).focus();
		}
	}

	getApplication(_identifier) {
		return this.launchedApplications.filter(v => v.identifier == _identifier)[0]
	}
});