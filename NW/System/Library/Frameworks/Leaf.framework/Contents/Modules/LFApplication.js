return class {
	constructor() {
		this.launched = CFArray.observe([], () => _CFEventEmitter.dispatch('LFApplication.Updated'));
	}

	load(_url) {
		try {
			var _url = _url.endsWith('.app') ? _url : _url+='.app',
				_bundle = new CFBundle(_url),
				_content = CFFile.content(_bundle.executables+'/'+_bundle.properties.CFBundleExecutable+'.js');
		}
		catch(_error) {
			new LFAlert({
				message: 'Application unable to load.',
				information: _error.name+': '+_error.message
			}).add(_LFWorkspace);

			return;
		}

		var _load = _LFApplication.get(_bundle.properties.CFBundleIdentifier);

		if(!_load) {
			_load = {
					bundle: _bundle,
					identifier: _bundle.properties.CFBundleIdentifier,
					executable: _bundle.properties.CFBundleExecutable,
					title: _bundle.properties.CFBundleTitle,
					icon: _bundle.resources+'/'+_bundle.properties.CFBundleIcon,
					application: undefined,
					menus: [],
					windows: [],
					update: function(_mode) {
						var _menus = this.menus,
							_windows = this.windows;

						if(_LFApplication.get(this.identifier)) {
							return {
								Menus: () => {
									_LFMenubar.setGroup('Application', [
										new LFButton({ title: this.title, action: () => this.quit() }),
										..._menus
									]);
								},
								Windows: () => {
									_windows = _windows.filter(v => v.class == 'LFWindow');
									for(var v of _windows.filter(v => v.application == undefined)) {
										Object.defineProperty(v, 'application', {
											value: this,
											writable: false
										});
									}
									_LFWorkspace.addSubviews(_windows);
								}
							}[_mode]();
						}
					},
					focus: function() {
						this.update('Menus');
					},
					launch: function() {
						if(!_LFApplication.get(this.identifier)) {
							try {
								_LFApplication.launched.push(this);
								this.application = new (new Function('_LFApp', _content)(this))();
							}
							catch(_error) {
								this.quit(true);
								new LFAlert({
									message: '"'+_load.title+'" unable to launch.',
									information: _error.name+': '+_error.message
								}).add(_LFWorkspace);
							}
						} else {
							this.focus();
						}

						return this;
					},
					about: function(_value) {
						var _about =
								new LFWindow({ tag: 'about', width: 256, style: ['titled', 'closable', 'miniaturizable'], title: undefined, view:
									new LFView({ type: 'vertical', yAlign: 'center', subviews: [
										new LFImage({ width: _value.width, height: _value.height, url: this.icon }),
										new LFText({ string: this.title, weight: 'bold' })
									] })
								}),
							_window = this.windows.filter(v => v.tag == 'about')[0];

						if(_LFApplication.get(this.identifier)) {
							if(!_window) this.windows.push(_about); else _window.focus();
						}
					},
					quit: function(_permanent) {
						CFArray.remove(_LFApplication.launched, this);
						this.application = undefined;
						this.menus.length = 0;
						this.windows.length = 0;

						_LFMenubar.setGroup('Application', []);
						for(var v of _LFWorkspace.subviews.filter(v => v.application == this)) v.destroy();

						if(_permanent !== true && ['ru.poppy.enviro', 'ru.poppy.dock'].includes(this.identifier)) {
							this.launch();
						} else {
							_LFApplication.launched[0].focus();
						}
					}
				}
				_load.menus = CFArray.observe([], () => _load.update('Menus'));
				_load.windows = CFArray.observe([], () => _load.update('Windows'));
				Object.defineProperties(_load, {
					bundle:		{ writable: false }, identifier:	{ writable: false },
					title:		{ writable: false }, icon:			{ writable: false },
					menus:		{ writable: false }, windows:		{ writable: false },
					update:		{ writable: false }, focus:			{ writable: false },
					launch:		{ writable: false }, quit:			{ writable: false }
				});
				_load = Object.seal(_load);
		}

		return _load;
	}

	get(_application) {
		return this.launched.filter(v => v.bundle.properties.CFBundleIdentifier == _application)[0]
	}
}