return _CFShared.@Title || _single(class {
	constructor() {
		this.__element;
		this.__event;
		this.__type;
		this.__hidden = false;

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
			this.__element = $('<@Title>').appendTo('body');
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
});