return class {
	#services = [
		{
			identifier: 'ru.poppy.enviro',
			url: '/Environment/Library/Applications/Enviro',
			error: false
		},
		{
			identifier: 'ru.poppy.dock',
			url: '/Environment/Library/Applications/Dock',
			error: false
		}
	]

	constructor() {
		_import('Leaf');

		new LFApp().focusingPolicy = 1;

		new CGCursor();
		new CGFontManager('/Environment/Library/Fonts');
		new LFWorkspace().desktopImage = '/Library/Desktop Images/249785.jpg';
		new LFWorkspace().add();

		new CFProcessInfo().environment._PoppyMenu = new LFMenu({ x: 8, y: 24, items: [
			new LFMenuItem({ title: 'About This Poppy', action: () => new LFWorkspace().getApplication('ru.poppy.enviro').cautiously('aboutSystem') }),
			new LFMenuItem().separator(),
			new LFMenuItem({ title: 'Environment Preferences', action: () => new LFWorkspace().launchApplication('/Applications/Environment Preferences') }),
			new LFMenuItem({ title: 'Dock',
				menu: new LFMenu({ items: [
					new LFMenuItem({ title: 'Test Alert', action: () => new LFAlert() }),
					new LFMenuItem({ title: 'Submenu',
						menu: new LFMenu({ items: [
							new LFMenuItem(),
							new LFMenuItem()
						] })
					})
				] })
			}),
			new LFMenuItem().separator(),
			new LFMenuItem({ title: 'Force Quit', action: () => this.forceQuit() }),
			new LFMenuItem({ title: 'Activity Monitor', action: () => new LFWorkspace().launchApplication('/Applications/Activity Monitor') }),
			new LFMenuItem().separator(),
			new LFMenuItem({ title: 'Relaunch', action: () => _request('relaunch') }),
			new LFMenuItem({ title: 'Quit', action: () => _request('quit') })
		] }).add();

		this.launchServices();
		CFArray.addObserver(new LFWorkspace().launchedApplications, () => this.launchServices());
	}

	launchServices() {
		for(let v of this.#services) {
			if(!v.error && !new LFWorkspace().getApplication(v.identifier)) {
				try {
					new LFWorkspace().launchApplication(v.url);
				} catch {
					v.error = true;
				}
			}
		}
	}

	forceQuit() {
		let _window = new LFApp().windows.filter(v => v.tag == 'forceQuit')[0];

		if(!_window) {
			new LFWindow({ tag: 'forceQuit', width: 384, style: ['titled', 'closable', 'resizable'], title: 'Force Quit Applications',
				view: new LFView({ type: 'vertical', subviews: [
					new LFText({ string: 'If an application doesn\'t respond for a while, select it\'s title and click Force Quit.', size: 'small' })
				] })
			});
		} else {
			_window.focus();
		}
	}

	deconstructor() {
		new CGCursor().remove();
		new LFWorkspace().remove();

		new CFProcessInfo().environment._PoppyMenu = undefined;
	}
}