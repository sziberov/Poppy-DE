// noinspection JSAnnotator
return $CFShared.@Title || _single(class extends LFView {
	constructor(_) {
		super(_);
		this.class = '@Title';
		this._ = {
			...this._,
			desktopImage: '',
			..._
		}

		this.__layer = new CGLayer(CGScreen.frame.width, CGScreen.frame.height);
		this.__launchedApplications = new CFArray();

		this.desktopImage = this.desktopImage;

		this.subviews.add(new LFMenubar({ transparent: true }));
		CFEventEmitter.addHandler('processListChanged', (a) => {
			if(a.event == 'removed') {
				let application = this.launchedApplications.find(v => v.processIdentifier == a.value),
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

				let default_ = this.getApplication('ru.poppy.enviro');

				if(focused == application && default_) {
					default_.focus();
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

	draw() {
		let layer = new CGLayer(CGScreen.frame.width, CGScreen.frame.height),
			menubar = new CGLayer(CGScreen.frame.width, 24),
			menubarShadow = new CGLayer(menubar.width, menubar.height);

		layer.drawLayer(new CGImage(this.desktopImage), 0, 0, '100', '100');
		layer.blur(0, 0, menubar.width, menubar.height, 4, true, true);
		menubar.drawGradient([
			[0, CGColor('100','100','100', '75')],
			[1, CGColor('100','100','100', '25')]
		], 0, 0, menubar.width, menubar.height, 0, 0, 0, menubar.height);
		menubarShadow.drawGradient([
			[0, CGColor('0','0','0', '25')],
			[1, CGColor('0','0','0', '0')]
		], 0, 0, menubarShadow.width, menubarShadow.height, 0, 0, 0, menubarShadow.height);

		layer.drawLayer(menubar);
		layer.drawLayer(menubarShadow, 0, menubar.height);

		this.__layer.drawLayer(layer);
		this.__layer.draw();

	//	return layer;
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
				let user = new CFPreferences('Global').get().Users.find(v => v.Group == 1);

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
		return this.launchedApplications.find(v => v.identifier == identifier);
	}
});