// noinspection JSAnnotator
return $CFShared[_title] || class LFWorkspace extends LFView {
	static __shared;

	static get shared() {
		if(!this.__shared) {
			new this();
		}

		return this.__shared;
	}

	static destroyShared() {
		this.__shared = undefined;
	}

	__launchedApplications = new CFArray();
	__desktopImage;

	constructor({ desktopImage } = {}) {
		super(...arguments);
		if(!this.constructor.__shared) {
			this.constructor.__shared = this;
		} else {
			console.error(0); return;
		}

		this.desktopImage = desktopImage;

		this.subviews.add(new LFMenubar({ transparent: true }));
		CFEvent.addHandler('processListChanged', (a) => {
			if(a.event === 'removed') {
				let application = this.launchedApplications.find(v => v.processIdentifier === a.value),
					menu = LFMenubar.shared.applicationMenu,
					focused = menu.application;

				this.launchedApplications.remove(application);
				if(focused === application) {
					menu.items = []
					menu.application = undefined;
				}
				for(let v of this.subviews.filter(v => v.application === application)) {
					v.destroy();
				}

				let default_ = this.getApplication('ru.poppy.enviro');

				if(focused === application && default_) {
					default_.focus();
				} else
				if(focused !== application) {
					focused.focus();
				}
			}
		});
		CFArray.addObserver(this.subviews, (a) => {
			if(!Object.isKindOf(a.value, LFWindow)) {
				return;
			}
			if(a.event === 'added') {
				a.value.ID = CGSWindowServer.shared.createWindow(
					CGSConnection.shared,
					undefined,
					a.value.origin.x,	// Может вернуть 'center', что не соответствует ожидаемому типу
					a.value.origin.y,	// ...
					a.value.size.width,
					a.value.size.height
				);
			} else
			if(a.event === 'removed') {
				CGSWindowServer.shared.destroyWindow(a.value.ID);
			}
		});
	}

	get launchedApplications() {
		return this.__launchedApplications;
	}

	get desktopImage() {
		return this.__desktopImage;
	}

	set desktopImage(value) {
		if(value && typeof value !== 'string') {
			throw new TypeError();
		}

		this.__desktopImage = value;
		this.style['background-image'] = `url('${ value ?? '' }')`;
	}

	mousedown() {
		LFMenu.deactivateAll();
	}

	launchApplication(URL, ...arguments_) {
		URL = URL.endsWith('.app') ? URL : URL+'.app';

		try {
			var bundle = new CFBundle(URL),
				identifier = bundle.properties.CFBundleIdentifier,
				title = bundle.properties.CFBundleTitle;
		} catch(error) {
			new LFAlert({
				message: 'Application unable to load.',
				information: error.name+': '+error.message
			});

			throw error;
		}

		if(!this.getApplication(identifier)) {
			try {
				let user = new CFPreferences('Global').get().Users.find(v => v.Group === 1);

				_request('exec', user.Login, user.Password, bundle.executablesURL+'/'+bundle.properties.CFBundleExecutable+'.js', ...arguments_);

				return this.getApplication(identifier);
			} catch(error) {
				if(this.getApplication(identifier)) {
					this.getApplication(identifier).quit();
				}
				new LFAlert({
					message: `"${ title }" unable to launch.`,
					information: error.name+': '+error.message
				});

				throw error;
			}
		} else {
			this.getApplication(identifier).focus();
		}
	}

	getApplication(identifier) {
		return this.launchedApplications.find(v => v.identifier === identifier);
	}
}