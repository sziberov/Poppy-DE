return class {
	constructor() {
		_import('Leaf');

		new LFWindow({ width: 768, height: 512, style: ['titled', 'closable', 'minimizable', 'resizable', 'unifiedTitlebarAndToolbar'], title: new LFApp().title,
			toolbar: new LFToolbar({ subviews: [
				new LFButton({ title: '', image: new LFImage({ shared: 'TemplateBackward' }) }),
				new LFButton({ title: '', image: new LFImage({ shared: 'TemplateForward' }) })
			] }),
			view: new LFView({ subviews: [] })
		});
	}
}