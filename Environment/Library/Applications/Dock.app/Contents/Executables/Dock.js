return class {
	constructor() {
		_import('Leaf');

		LFApp.focusingPolicy = 1;

		/*
		new LFWindow({ level: 'base', type: ['borderless', 'fullscreen'], background: '#404040', view:
			new LFView()
		});
		new LFWindow({ tag: 'background', level: 'background', type: ['borderless', 'fullscreen'], view:
			new LFView({
				subviews: new LFImage()
			})
		});
		*/

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
}