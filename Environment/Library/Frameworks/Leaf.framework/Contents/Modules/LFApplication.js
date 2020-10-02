return _single(class {
	#menus = CFArray.observe([], () => this.update('Menus'));
	#focusingPolicy = 0;
	#quitableBySingleWindow = false;

	constructor() {
		this.process.environment.LFApp = @Title;
		/*
		this.application = new Proxy(this.process.executable, {
			get: (target, property, receiver) => {
				let that = this;

				return function(...args) {
					try {
						let result = target[property].apply(this, args);
					} catch(error) {
						new LFAlert({
							message: `"${that.title}"'s method returned exception.`,
							information: error.name+': '+error.message
						});
					}

					return result;
				}
			}
		});
		*/

		new LFWorkspace().launchedApplications.add(new LFLaunchedApplication(this));
		CFArray.addObserver(new LFWorkspace().subviews, (a) => {
			if(/*a.event == 'added' &&*/ a.value.application == new LFLaunchedApplication() && a.value.class == 'LFWindow') {
				this.update('Windows')
			}
		});
	}

	get menus() {
		return this.#menus;
	}

	get windows() {
		return new LFWorkspace().subviews.filter(v => v.application == new LFLaunchedApplication() && v.class == 'LFWindow');
	}

	get focusingPolicy() {
		return this.#focusingPolicy;
	}

	get quitableBySingleWindow() {
		return this.#quitableBySingleWindow;
	}

	get process() {
		return new CFProcessInfo();
	}

	get application() {
		return this.process.executable;
	}

	get bundle() {
		return new CFBundle(this.process.path.split('.app')[0]+'.app');
	}

	get identifier() {
		return this.bundle.properties.CFBundleIdentifier;
	}

	get executable() {
		return this.bundle.properties.CFBundleExecutable;
	}

	get title() {
		return this.bundle.properties.CFBundleTitle;
	}

	get version() {
		return this.bundle.properties.CFBundleVersion;
	}

	get license() {
		return this.bundle.properties.CFBundleLicense;
	}

	get icon() {
		return this.bundle.properties.CFBundleIcon && this.bundle.resources+'/'+this.bundle.properties.CFBundleIcon;
	}

	set menus(_value) {
		this.#menus.length = 0;
		this.#menus.push(..._value);
	}

	set focusingPolicy(_value) {
		if([0, 1, 2].includes(_value)) {
			this.#focusingPolicy = _value;
		}
		this.update('Menus');
		this.update('Windows');
	}

	set quitableBySingleWindow(_value) {
		if([false, true].includes(_value)) {
			this.#quitableBySingleWindow = _value;
		}
	}

	update(_mode) {
		return {
			Menus: () => {
				CFArray.remove(this.menus, ...this.menus.filter(v => v.class !== 'LFMenu'));

				if(this.focusingPolicy < 1 && new LFWorkspace().getApplication(this.identifier)) {
					let _menus = this.menus,
						_array = [
							new LFButton({ title: this.title,
								menu: new LFMenu({ items: [
									new LFMenuItem({ title: 'About '+this.title, action: () => this.about() }),
									new LFMenuItem().separator(),
									new LFMenuItem({ title: 'Quit', action: () => this.quit() })
								] })
							})
						]

					for(let v of _menus) {
						_array.push(
							new LFButton({ title: v.title, menu: v.items?.length > 0 ? v : undefined })
						);
					}
					new LFMenubar().setGroup('Application', _array, new LFLaunchedApplication());
				} else {
					let _applications = new LFWorkspace().launchedApplications;

					if(_applications.length > 1) {
						_applications[1].focus('Menu');
					}
				}
			},
			Windows: () => {
				let _windows = this.windows;

				if(this.focusingPolicy < 2) {
					new LFWorkspace().addSubviews(_windows);
				} else {
					for(let v of _windows) {
						v.remove();
					}
				}
			}
		}[_mode]();
	}

	focus(_mode) {
		if(!_mode || _mode == 'Menu') {
			if(this.focusingPolicy < 1 && new LFMenubar().getGroup('Application').application !== new LFLaunchedApplication()) {
				this.update('Menus');
			}
		}
		if(!_mode || _mode == 'Window') {
			let _windows = this.windows;

			if(this.focusingPolicy < 2 && _windows.filter(v => v.attributes['focused'] == undefined).length == _windows.length && _windows.length > 0) {
				_windows.filter(v => v.main == true)[0]?.focus();
			}
		}
	}

	cautiously(_method, ..._arguments) {
		try {
			this.application[_method](..._arguments);
		} catch(error) {
			new LFAlert({
				message: `"${this.title}"'s method returned exception.`,
				information: error.name+': '+error.message
			});
		}
	}

	about() {
		if(typeof this.application.about === 'function') {
			this.application.about();
		} else {
			let _window = this.windows.filter(v => v.tag == 'about')[0];

			if(!_window) {
				let _about =
					new LFWindow({ tag: 'about', width: 256, style: ['titled', 'closable', 'minimizable'], title: undefined, view:
						new LFView({ type: 'vertical', yAlign: 'center', subviews: [
							...this.icon ? [new LFImage({ width: 64, height: 64, url: this.icon })] : [],
							new LFText({ string: this.title, weight: 'bold' }),
							...this.version ? [new LFText({ string: 'Version '+this.version, size: 'small' })] : [],
							...this.license ? [new LFText({ string: this.license, size: 'small' })] : []
						] })
					});

				this.windows.push(_about);
			} else {
				_window.focus();
			}
		}
	}

	quit() {
		if(new LFWorkspace().getApplication(this.identifier)) {
			let _focused = new LFMenubar().getGroup('Application').application;

			new LFWorkspace().launchedApplications.remove(new LFLaunchedApplication());

			new LFMenubar().setGroup('Application', []);
			for(let v of new LFWorkspace().subviews.filter(v => v.application == new LFLaunchedApplication())) {
				v.destroy();
			}

			_request('kill');

			let _default = new LFWorkspace().getApplication('ru.poppy.enviro');

			if(_focused == new LFLaunchedApplication() && _default) {
				_default.focus();
			} else
			if(_focused !== new LFLaunchedApplication()) {
				_focused.focus();
			}
		}
	}
});