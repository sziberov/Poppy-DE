_import('Leaf');

// noinspection JSAnnotator
return class Main {
	desktopImageWindow;

	constructor() {
		LFApp.focusingPolicy = 1;

		this.desktopImageWindow = new LFWindow({ level: 'background', type: ['borderless', 'fullscreen'], view:
			new LFView()
		});

		this.updateDesktopImage();
		CFEvent.addHandler('LFWorkspaceDesktopImageNotification', (a) => this.updateDesktopImage(a));

		/*
		<Dock>
			<List>
				<Item active></Item>
				<Item></Item>
			</List>
			<Activity></Activity>
		</Dock>
		*/
	}

	updateDesktopImage(a) {
		this.desktopImageWindow.style['background'] = a ? a.event === 'changed' ? `url('${ a.value }') center / cover` : 'none' : `url('${ LFWorkspace.shared.desktopImage }') center / cover`;
	}
}