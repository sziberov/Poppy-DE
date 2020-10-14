return _single(class {
	#user = new CFDefaults('ru.poppy.login').get('users').filter(v => v.login == new CFProcessInfo().user)[0]

	get id() {
		return this.#user.id;
	}

	get login() {
		return this.#user.login;
	}

	get password() {
		return this.#user.password;
	}

	get group() {
		return this.#user.group;
	}

	get hidden() {
		return this.#user.hidden;
	}

	get title() {
		return this.#user.title;
	}

	get image() {
		return this.#user.image;
	}
});