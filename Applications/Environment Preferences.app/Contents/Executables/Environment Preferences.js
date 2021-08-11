_import('Leaf');

// noinspection JSAnnotator
return class Main {
	constructor() {
		this.initialize().catch(error => {
			throw error;
		});
	}

	async initialize() {
		LFApp.quitableBySingleWindow = true;

		LFApp.menuItems = [
			new LFMenuItem({ title: await CFLocalizedString('Edit') }),
			new LFMenuItem({ title: await CFLocalizedString('View') }),
			new LFMenuItem({ title: await CFLocalizedString('Window') }),
			new LFMenuItem({ title: await CFLocalizedString('Help') })
		]

		new LFWindow({ width: 768, height: 512, type: ['titled', 'closable', 'minimizable', 'unifiedTitlebarAndToolbar'], title: LFApp.title,
			toolbar: new LFToolbar({ subviews: [
					new LFButton({ title: '', image: await LFImage.new({ shared: 'TemplateBackward' }) }),
					new LFButton({ title: '', image: await LFImage.new({ shared: 'TemplateForward' }) })
				] }),
			view: new LFView({ subviews: [] })
		}).center();
	}
}