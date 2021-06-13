// noinspection JSAnnotator
return class LFApplication {
	static __shared;

	static get shared() {
		if(!this.__shared) {
			new this();
		}

		return this.__shared;
	}

	__menuItems = new CFArray();
	__focusingPolicy = 0;
	__quitableBySingleWindow = false;

	constructor() {
		if(!this.constructor.__shared) {
			this.constructor.__shared = this;
		} else {
			console.error(0); return;
		}

		this.process.environment.LFApp = this.constructor.shared;

		LFWorkspace.shared.launchedApplications.add(new LFLaunchedApplication(this));
		CFArray.addObserver(LFWorkspace.shared.subviews, (a) => {
			if(a.value.application === LFLaunchedApplication.shared && Object.isKindOf(a.value, LFWindow)) {
				this.update('Windows');
			}
		});
		CFArray.addObserver(this.menuItems, () => this.update('MenuItems'));
	}

	get menuItems() {
		return this.__menuItems;
	}

	get windows() {
		return LFWorkspace.shared.subviews.filter(v => v.application === LFLaunchedApplication.shared && Object.isKindOf(v, LFWindow));
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
		value = value.filter(v => Object.isKindOf(v, LFMenuItem));

		this.__menuItems.removeAll().add(...value);
	}

	set focusingPolicy(value) {
		if(typeof value !== 'number')	throw new TypeError();
		if(value < 0 || value > 2)		throw new RangeError();

		this.__focusingPolicy = value;

		this.update('MenuItems');
		this.update('Windows');
	}

	set quitableBySingleWindow(value) {
		if(typeof value !== 'boolean') {
			throw new TypeError();
		}

		this.__quitableBySingleWindow = value;
	}

	update(mode) {
		return {
			MenuItems: () => {
				if(this.focusingPolicy < 1 && LFWorkspace.shared.getApplication(this.identifier)) {
					let bundle = new CFBundle(_path);

					LFMenubar.shared.applicationMenu.items = [
						new LFMenuItem({ title: this.title,
							menu: new LFMenu({ items: [
								new LFMenuItem({ title: CFLocalizedString('About', bundle)+' '+this.title, action: () => this.about() }),
								new LFMenuItem().separator(),
								new LFMenuItem({ title: CFLocalizedString('Services', bundle) }),
								new LFMenuItem().separator(),
								new LFMenuItem({ title: CFLocalizedString('Hide', bundle)+' '+this.title }),
								new LFMenuItem({ title: CFLocalizedString('Hide Others', bundle) }),
								new LFMenuItem({ title: CFLocalizedString('Show All', bundle) }),
								new LFMenuItem().separator(),
								new LFMenuItem({ title: CFLocalizedString('Quit', bundle)+' '+this.title, action: () => this.quit() })
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
		if(!mode || mode === 'Menu') {
			if(this.focusingPolicy < 1 && LFMenubar.shared.applicationMenu.application !== LFLaunchedApplication.shared) {
				this.update('MenuItems');
			}
		}
		if(!mode || mode === 'Window') {
			let windows = this.windows;

			if(this.focusingPolicy < 2 && windows.length > 0 && !windows.find(v => v.attributes['focused'] === '')) {
				windows.find(v => v.main === true)?.focus();
			}
		}
	}

	cautiously(method, ..._arguments) {
		try {
			this.application[method](..._arguments);
		} catch(error) {
			new LFAlert({
				message: `"${ this.title }"'s method returned exception.`,
				information: error.name+': '+error.message
			});
		}
	}

	about() {
		if(typeof this.application.about === 'function') {
			this.application.about();
		} else {
			let window = this.windows.find(v => v.tag === 'about');

			if(!window) {
				new LFWindow({ tag: 'about', width: 256, type: ['titled', 'closable', 'minimizable'], title: '', view:
					new LFView({ type: 'vertical', yAlign: 'center', subviews: [
						...this.icon ? [new LFImage({ width: 64, height: 64, url: this.icon })] : [],
						new LFText({ string: this.title, weight: 'bold' }),
						...this.version ? [new LFText({ string: CFLocalizedString('Version', new CFBundle(_path))+' '+this.version, size: 'small' })] : [],
						...this.license ? [new LFText({ string: this.license, size: 'small' })] : []
					] })
				}).center();
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