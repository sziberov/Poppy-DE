return class {
	constructor() {
		_import('Leaf');

		new LFApp().quitableBySingleWindow = true;

		new LFApp().menuItems = [
			new LFMenuItem({ title: CFLocalizedString('Edit') }),
			new LFMenuItem({ title: CFLocalizedString('View') }),
			new LFMenuItem({ title: CFLocalizedString('Window') }),
			new LFMenuItem({ title: CFLocalizedString('Help') })
		]

		new LFWindow({ x: 'center', y: 'center', width: 768, height: 512, style: ['titled', 'closable', 'minimizable', 'unifiedTitlebarAndToolbar'], title: new LFApp().title,
			toolbar: new LFToolbar({ subviews: [
				new LFButton({ title: '', image: new LFImage({ shared: 'TemplateBackward' }) }),
				new LFButton({ title: '', image: new LFImage({ shared: 'TemplateForward' }) })
			] }),
			view: new LFView({ subviews: [] })
		});
	}
}