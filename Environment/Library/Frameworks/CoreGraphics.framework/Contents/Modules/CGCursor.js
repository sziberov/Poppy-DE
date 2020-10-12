return _MainSE.@Title || _single(class {
	#element;
	#event;
	#type;
	#hidden = false;

	constructor() {
		this.add();
	}

	set type(value) {
		if(['default', 'wait', 'progress', 'copy', 'notAllowed', 'text', 'hidden'].includes(value)) {
			if(value !== 'default') {
				this.#type = value;
				this.#element.attr(value, '');
			} else {
				this.#element.removeAttr(this.#type);
				this.#type = undefined;
			}
		}
	}

	set hidden(value) {
		if([false, true].includes(value)) {
			this.#hidden = value;
			if(!value) {
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
			$('body').on('mousemove.'+this.#event, (event) => {
				this.#element.css('transform', 'translate('+event.pageX+'px, '+event.pageY+'px)');
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