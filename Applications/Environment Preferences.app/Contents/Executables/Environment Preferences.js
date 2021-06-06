return class {
	constructor() {
		_import('Leaf');

		LFApp.quitableBySingleWindow = true;

		LFApp.menuItems = [
			new LFMenuItem({ title: CFLocalizedString('Edit') }),
			new LFMenuItem({ title: CFLocalizedString('View') }),
			new LFMenuItem({ title: CFLocalizedString('Window') }),
			new LFMenuItem({ title: CFLocalizedString('Help') })
		]

		new LFWindow({ width: 768, height: 512, type: ['titled', 'closable', 'minimizable', 'unifiedTitlebarAndToolbar'], title: LFApp.title,
			toolbar: new LFToolbar({ subviews: [
				new LFButton({ title: '', image: new LFImage({ shared: 'TemplateBackward' }) }),
				new LFButton({ title: '', image: new LFImage({ shared: 'TemplateForward' }) })
			] }),
			view: new LFView({ subviews: [] })
		}).center();
	}
}