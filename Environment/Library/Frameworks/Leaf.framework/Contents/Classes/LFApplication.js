// noinspection JSAnnotator
return class LFApplication {
	static __shared;

	static get shared() {
		if(!this.__shared) {
			new this();
		}

		return this.__shared;
	}

	__menuItems = new CFArrayOld();
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
		CFArrayOld.addObserver(LFWorkspace.shared.subviews, (a) => {
			if(a.value.application === LFLaunchedApplication.shared && Object.isKindOf(a.value, LFWindow)) {
				this.update(1);
			}
		});
		CFArrayOld.addObserver(this.menuItems, () => this.update(0));
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
		return this.bundle?.properties.CFBundleIdentifier;
	}

	get executable() {
		return this.bundle?.properties.CFBundleExecutable ?? this.process.path.split('/').pop();
	}

	get title() {
		return this.bundle?.properties.CFBundleTitle ?? this.process.path.split('/').pop();
	}

	get version() {
		return this.bundle?.properties.CFBundleVersion;
	}

	get license() {
		return this.bundle?.properties.CFBundleLicense;
	}

	get icon() {
		if(this.bundle?.properties.CFBundleIcon) {
			return this.bundle.resourcesURL+'/'+this.bundle.properties.CFBundleIcon;
		}
	}

	set menuItems(value) {
		value = value.filter(v => Object.isKindOf(v, LFMenuItem));

		this.__menuItems.removeAll().add(...value);
	}

	set focusingPolicy(value) {
		if(typeof value !== 'number')	throw new TypeError();
		if(value < 0 || value > 2)		throw new RangeError();

		this.__focusingPolicy = value;

		this.update(0);
		this.update(1);
	}

	set quitableBySingleWindow(value) {
		if(typeof value !== 'boolean') {
			throw new TypeError();
		}

		this.__quitableBySingleWindow = value;
	}

	/**
	 * @param mode 0 - строка меню, 1 - окна.
	 */
	update(mode) {
		return {
			0: () => {
				if(this.focusingPolicy < 1 && LFWorkspace.shared.launchedApplications.find(v => v.processIdentifier === this.process.identifier)) {
					this.menuItems[0]?.title = this.title;
					LFMenubar.shared.applicationMenu.items = this.menuItems.length > 0 ? this.menuItems : [new LFMenuItem({ title: this.title })]
					LFMenubar.shared.applicationMenu.application = LFLaunchedApplication.shared;
				} else {
					let applications = LFWorkspace.shared.launchedApplications;

					if(LFMenubar.shared.applicationMenu.application === LFLaunchedApplication.shared && applications.length > 1) {
						applications[1].focus(0);
					}
				}
			},
			1: () => {
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

	/**
	 * @param mode 0 - строка меню, 1 - окно.
	 */
	focus(mode) {
		if(mode === undefined || mode === 0) {
			if(this.focusingPolicy < 1 && LFMenubar.shared.applicationMenu.application !== LFLaunchedApplication.shared) {
				this.update(0);
			}
		}
		if(mode === undefined || mode === 1) {
			let windows = this.windows;

			if(this.focusingPolicy < 2 && windows.length > 0 && !windows.find(v => v.attributes['focused'] === '')) {
				windows.find(v => v.main === true)?.focus();
			}
		}
	}

	cautiously(method, ..._arguments) {
		try {
			return this.application[method](..._arguments);
		} catch(error) {
			LFAlert.new({
				message: `"${ this.title }"'s method returned exception.`,
				information: error.name+': '+error.message
			});
		}
	}

	async about() {
		if(typeof this.application.about === 'function') {
			return this.application.about();
		} else {
			let window = this.windows.find(v => v.tag === 'about');

			if(!window) {
				new LFWindow({ tag: 'about', width: 256, type: ['titled', 'closable', 'minimizable'], title: '', view:
					new LFView({ type: 'vertical', yAlign: 'center', subviews: [
						await LFImage.new({ width: 64, height: 64, url: this.icon, shared: 'Generic Application' }),
						new LFText({ string: this.title, weight: 'bold' }),
						...this.version ? [new LFText({ string: await CFLocalizedString('Version', $LFBundle)+' '+this.version, size: 'small' })] : [],
						...this.license ? [new LFText({ string: this.license, size: 'small' })] : []
					] })
				}).center();
			} else {
				window.focus();
			}
		}
	}

	quit() {
		if(LFWorkspace.shared.launchedApplications.find(v => v.processIdentifier === this.process.identifier)) {
			try {
				this.process.executable?.willQuit?.();
			} catch {}

			_call('kill');
		}
	}
}