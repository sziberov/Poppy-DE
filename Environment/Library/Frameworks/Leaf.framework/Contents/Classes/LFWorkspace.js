return $CFShared.@Title || _single(class extends LFView {
	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			desktopImage: '',
			..._
		}

		this.__launchedApplications = new CFArray();

		this.desktopImage = this.desktopImage;

		this.subviews.add(new LFMenubar({ transparent: true }));
		CFEventEmitter.addHandler('processListChanged', (a) => {
			if(a.event == 'removed') {
				let application = this.launchedApplications.filter(v => v.processIdentifier == a.value)[0],
					menu = new LFMenubar().applicationMenu,
					focused = menu.application;

				this.launchedApplications.remove(application);
				if(focused == application) {
					menu.items = []
					menu.application = undefined;
				}
				for(let v of this.subviews.filter(v => v.application == application)) {
					v.destroy();
				}

				let _default = this.getApplication('ru.poppy.enviro');

				if(focused == application && _default) {
					_default.focus();
				} else
				if(focused !== application) {
					focused.focus();
				}
			}
		});
	}

	get launchedApplications() {
		return this.__launchedApplications;
	}

	get desktopImage() {
		return this._.desktopImage;
	}

	set desktopImage(value) {
		this._.desktopImage = value;
		this.style['background-image'] = 'url(\''+value+'\')';
	}

	mousedown() {
		LFMenu.deactivateAll();
	}

	launchApplication(URL, ...arguments_) {
		URL = URL.endsWith('.app') ? URL : URL+='.app';

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
				let user = new CFPreferences('Global').get().Users.filter(v => v.Group == 1)[0]

				_request('exec', user.Login, user.Password, bundle.executablesURL+'/'+bundle.properties.CFBundleExecutable+'.js', ...arguments_);

				return this.getApplication(identifier);
			} catch(error) {
				if(this.getApplication(identifier)) {
					this.getApplication(identifier).quit();
				}
				new LFAlert({
					message: `"${title}" unable to launch.`,
					information: error.name+': '+error.message
				});

				throw error;
			}
		} else {
			this.getApplication(identifier).focus();
		}
	}

	getApplication(identifier) {
		return this.launchedApplications.filter(v => v.identifier == identifier)[0]
	}
});