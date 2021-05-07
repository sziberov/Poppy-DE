return class {
	static get shared() {
		if(!this.__shared) {
			new this();
		}

		return this.__shared;
	}

	constructor() {
		if(!this.constructor.__shared) {
			this.constructor.__shared = this;
		} else {
			console.error(0); return;
		}

		this.__menuItems = new CFArray();
		this.__focusingPolicy = 0;
		this.__quitableBySingleWindow = false;

		this.process.environment.LFApp = @Title.shared;
		/*
		this.application = new Proxy(this.process.executable, {
			get: (target, key) => {
				if(typeof target[key] === 'function') {
					return (..._arguments) => {
						try {
							return target[key](..._arguments);
						} catch(error) {
							new LFAlert({
								message: `"${this.title}"'s method returned exception.`,
								information: error.name+': '+error.message
							});
						}
					}
				} else {
					return target[key]
				}
			}
		});
		*/

		LFWorkspace.shared.launchedApplications.add(new LFLaunchedApplication(this));
		CFArray.addObserver(LFWorkspace.shared.subviews, (a) => {
			if(a.value.application == LFLaunchedApplication.shared && a.value.class == 'LFWindow') {
				this.update('Windows');
			}
		});
		CFArray.addObserver(this.menuItems, () => this.update('MenuItems'));
	}

	get menuItems() {
		return this.__menuItems;
	}

	get windows() {
		return LFWorkspace.shared.subviews.filter(v => v.application == LFLaunchedApplication.shared && v.class == 'LFWindow');
	}

	get focusingPolicy() {
		return this.__focusingPolicy;
	}

	get quitableBySingleWindow() {
		return this.__quitableBySingleWindow;
	}

	get process() {
		return CFProcessInfo.shared;
	}

	get application() {
		return this.process.executable;
	}

	get bundle() {
		return CFBundle.main;
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
		return this.bundle.properties.CFBundleIcon && this.bundle.resourcesURL+'/'+this.bundle.properties.CFBundleIcon;
	}

	set menuItems(value) {
		value = value.filter(v => v.class == 'LFMenuItem');

		this.__menuItems.removeAll().add(...value);
	}

	set focusingPolicy(value) {
		if([0, 1, 2].includes(value)) {
			this.__focusingPolicy = value;
		}
		this.update('MenuItems');
		this.update('Windows');
	}

	set quitableBySingleWindow(value) {
		if([false, true].includes(value)) {
			this.__quitableBySingleWindow = value;
		}
	}

	update(mode) {
		return {
			MenuItems: () => {
				if(this.focusingPolicy < 1 && LFWorkspace.shared.getApplication(this.identifier)) {
					LFMenubar.shared.applicationMenu.items = [
						new LFMenuItem({ title: this.title,
							menu: new LFMenu({ items: [
								new LFMenuItem({ title: CFLocalizedString('About', '@Resources')+' '+this.title, action: () => this.about() }),
								new LFMenuItem().separator(),
								new LFMenuItem({ title: CFLocalizedString('Services', '@Resources') }),
								new LFMenuItem().separator(),
								new LFMenuItem({ title: CFLocalizedString('Hide', '@Resources')+' '+this.title }),
								new LFMenuItem({ title: CFLocalizedString('Hide Others', '@Resources') }),
								new LFMenuItem({ title: CFLocalizedString('Show All', '@Resources') }),
								new LFMenuItem().separator(),
								new LFMenuItem({ title: CFLocalizedString('Quit', '@Resources')+' '+this.title, action: () => this.quit() })
							] })
						}),
						...this.menuItems
					]
					LFMenubar.shared.applicationMenu.application = LFLaunchedApplication.shared;
				} else {
					let applications = LFWorkspace.shared.launchedApplications;

					if(applications.length > 1) {
						applications[1].focus('Menu');
					}
				}
			},
			Windows: () => {
				if(this.focusingPolicy < 2) {
					LFWorkspace.shared.addSubviews(this.windows);
				} else {
					for(let v of this.windows) {
						v.remove();
					}
				}
			}
		}[mode]();
	}

	focus(mode) {
		if(!mode || mode == 'Menu') {
			if(this.focusingPolicy < 1 && LFMenubar.shared.applicationMenu.application !== LFLaunchedApplication.shared) {
				this.update('MenuItems');
			}
		}
		if(!mode || mode == 'Window') {
			let windows = this.windows;

			if(this.focusingPolicy < 2 && windows.length > 0 && !windows.find(v => v.attributes['focused'] == '')) {
				windows.find(v => v.main == true)?.focus();
			}
		}
	}

	cautiously(method, ..._arguments) {
		try {
			this.application[method](..._arguments);
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
			let window = this.windows.find(v => v.tag == 'about');

			if(!window) {
				new LFWindow({ tag: 'about', x: 'center', y: 'center', width: 256, style: ['titled', 'closable', 'minimizable'], title: undefined, view:
					new LFView({ type: 'vertical', yAlign: 'center', subviews: [
						...this.icon ? [new LFImage({ width: 64, height: 64, url: this.icon })] : [],
						new LFText({ string: this.title, weight: 'bold' }),
						...this.version ? [new LFText({ string: CFLocalizedString('Version', '@Resources')+' '+this.version, size: 'small' })] : [],
						...this.license ? [new LFText({ string: this.license, size: 'small' })] : []
					] })
				});
			} else {
				window.focus();
			}
		}
	}

	quit() {
		if(LFWorkspace.shared.getApplication(this.identifier)) {
			try {
				this.process.executable?.willQuit?.();
			} catch(error) {}

			_request('kill');
		}
	}
}