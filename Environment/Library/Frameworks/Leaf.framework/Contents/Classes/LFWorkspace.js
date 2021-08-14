// noinspection JSAnnotator
return $CFShared[_title] ?? class LFWorkspace extends LFView {
	static __shared;

	static get shared() {
		if(!this.__shared) {
			new this();
		}

		return this.__shared;
	}

	__launchedApplications = new CFArrayOld();
	__desktopImageURL;

	constructor({ desktopImageURL } = {}) {
		super(...arguments);
		if(!this.constructor.__shared) {
			this.constructor.__shared = this;
		} else {
			console.error(0); return;
		}

		this.desktopImageURL = desktopImageURL;

		this.subviews.add(new LFMenubar({ transparent: true }));
		CFEvent.addHandler('processListChanged', (a) => {
			if(a.event === 'removed') {
				let application = this.launchedApplications.find(v => v.processIdentifier === a.value),
					menu = LFMenubar.shared.applicationMenu,
					focused = menu.application;

				if(!application) {
					return;
				}

				this.launchedApplications.remove(application);
				if(focused === application) {
					menu.items = []
					menu.application = undefined;
				}
				for(let v of this.subviews.filter(v => v.application === application)) {
					v.release();
				}

				let default_ = this.launchedApplications.find(v => v.identifier === 'ru.poppy.enviro');

				if(focused === application && default_) {
					default_.focus();
				}
				if(focused !== application) {
					focused.focus();
				}
			}
		});
		CFArrayOld.addObserver(this.subviews, (a) => {
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

	get desktopImageURL() {
		return this.__desktopImageURL;
	}

	set desktopImageURL(value) {
		if(value && typeof value !== 'string') {
			throw new TypeError();
		}

		this.__desktopImageURL = value;

		CFEvent.dispatch(undefined, _title+'DesktopImageNotification', { event: value ? 'changed' : 'removed', value: value });
	}

	mousedown() {
		LFMenu.deactivateAll();
	}

	async launch(URL, ...arguments_) {
		let user = (await CFPreferences.new('Global')).get().Users.find(v => v.Group === 1);

		return _call('exec', user.Login, user.Password, URL, ...arguments_);
	}

	async launchApplication(URL, ...arguments_) {
		URL = URL.endsWith('.app') ? URL : URL+'.app';

		if(this.getApplication(URL)) {
			this.getApplication(URL).focus();

			return this.getApplication(URL);
		}

		let bundle = await CFBundle.new(URL),
			title = bundle.properties.CFBundleTitle ?? URL.split('/').pop().replace(/\.app$/, ''),
			user = (await CFPreferences.new('Global')).get().Users.find(v => v.Group === 1);

		try {
			if(!bundle.properties.CFBundleExecutable) {
				throw new Error(`Properties list has no executable set`);
			}

			await _call('exec', user.Login, user.Password, bundle.executablesURL+'/'+bundle.properties.CFBundleExecutable+'.js', ...arguments_);

			return this.getApplication(URL);
		} catch(error) {
			this.getApplication(URL)?.quit();
			LFAlert.new({
				message: `"${ title }" unable to launch.`,
				information: error.name+': '+error.message
			});

			throw(error);
		}
	}

	getApplication(bundleURL) {
		return this.launchedApplications.find(v => v.bundleURL === bundleURL);
	}

	release() {
		super.release();

		this.constructor.__shared = undefined;
	}
}