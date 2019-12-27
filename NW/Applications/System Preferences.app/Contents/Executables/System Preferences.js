return class {
	constructor() {
		_LFApp.windows.push(
			new LFWindow({ width: 768, height: 512, title: _LFApp.title,
				toolbar: new LFToolbar({ subviews: [
					new LFButton({ title: '', image: new LFImage({ shared: 'TemplateBackward' }) }),
					new LFButton({ title: '', image: new LFImage({ shared: 'TemplateForward' }) })
				] }),
				view: new LFView({ subviews: [] })
			})
		)
	}
}