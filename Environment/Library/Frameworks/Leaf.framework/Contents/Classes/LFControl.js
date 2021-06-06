// noinspection JSAnnotator
return class LFControl extends LFView {
	__action;

	constructor({ action } = {}) {
		super(...arguments);

		this.action = action;
	}

	get highlighted() {
		return this.attributes['highlighted'] === '';
	}

	get activated() {
		return this.attributes['activated'] === '';
	}

	get enabled() {
		return this.attributes['enabled'] === '';
	}

	get action() {
		return this.__action;
	}

	set highlighted(value) {
		if(typeof value !== 'boolean') {
			throw new TypeError();
		}

		this.attributes['highlighted'] = value ? '' : undefined;
	}

	set activated(value) {
		if(typeof value !== 'boolean') {
			throw new TypeError();
		}

		this.attributes['activated'] = value ? '' : undefined;
	}

	set action(value) {
		if(value && typeof value !== 'function') {
			throw new TypeError();
		}

		this.__action = value;
		this.attributes['enabled'] = value ? '' : undefined;
	}

	click() {
		this.action?.();
	}

	mouseover() {
		this.highlighted = true;
	}

	mouseleave() {
		this.highlighted = false;
		this.activated = false;
	}

	mousedown(event, exceptView) {
		event.stopPropagation();
		if(event.button === 0) {
			this.activated = true;
		}
		LFMenu.deactivateAll(exceptView);
		this.get('Superview', LFWindow)?.focus();
	}

	mouseup() {
		this.activated = false;
	}
}