// noinspection JSAnnotator
return $CFShared[_title] ?? class CGCursor {
	static __shared;

	static get shared() {
		if(!this.__shared) {
			new this();
		}

		return this.__shared;
	}

	__element;
	__event;
	__type;
	__hidden = false;

	constructor() {
		if(!this.constructor.__shared) {
			this.constructor.__shared = this;
		} else {
			console.error(0); return;
		}

		this.add();
	}

	set type(value) {
		if(['default', 'wait', 'progress', 'copy', 'notAllowed', 'text', 'hidden'].includes(value)) {
			if(value !== 'default') {
				this.__type = value;
				this.__element.attr(value, '');
			} else {
				this.__element.removeAttr(this.__type);
				this.__type = undefined;
			}
		}
	}

	set hidden(value) {
		if([false, true].includes(value)) {
			this.__hidden = value;
			if(!value) {
				this.__element.removeAttr('hidden');
			} else {
				this.__element.attr('hidden', '');
			}
		}
	}

	add() {
		if(!this.__element) {
			this.__element = $('<'+_title+'>').appendTo('body');
			this.__event = $._data($('body')[0], 'events')?.mousemove?.length+1 || 1;
			$('body').on('mousemove.'+this.__event, (event) => {
				this.__element.css('transform', 'translate('+event.pageX+'px, '+event.pageY+'px)');
			});
		}

		return this;
	}

	remove() {
		if(this.__element) {
			this.__element.remove();
			$('body').off('mousemove.'+this.__event);
		}

		return this;
	}
}