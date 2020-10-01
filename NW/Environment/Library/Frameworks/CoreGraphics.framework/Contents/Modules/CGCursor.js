return _fork('@Title') || _single(class {
	#element;
	#event;
	#type;
	#hidden = false;

	constructor() {
		this.add();
	}

	set type(_value) {
		if(['default', 'wait', 'progress', 'copy', 'notAllowed', 'text', 'hidden'].includes(_value)) {
			if(_value !== 'default') {
				this.#type = _value;
				this.#element.attr(_value, '');
			} else {
				this.#element.removeAttr(this.#type);
				this.#type = undefined;
			}
		}
	}

	set hidden(_value) {
		if([false, true].includes(_value)) {
			this.#hidden = _value;
			if(!_value) {
				this.#element.removeAttr('hidden');
			} else {
				this.#element.attr('hidden', '');
			}
		}
	}

	add() {
		if(!this.#element) {
			this.#element = $('<@Title>').appendTo('body');
			this.#event = $._data($('body')[0], 'events')?.mousemove?.length+1 || 1;
			$('body').on('mousemove.'+this.#event, (_event) => {
				this.#element.css('transform', 'translate('+_event.pageX+'px, '+_event.pageY+'px)');
			});
		}

		return this;
	}

	remove() {
		if(this.#element) {
			this.#element.remove();
			$('body').off('mousemove.'+this.#event);
		}

		return this;
	}
});