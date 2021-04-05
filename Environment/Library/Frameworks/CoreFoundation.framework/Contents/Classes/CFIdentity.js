return _single(class {
	#user = new CFPreferences('Global').get().Users.filter(v => v.Login == new CFProcessInfo().user)[0]

	get id() {
		return this.#user.ID;
	}

	get login() {
		return this.#user.Login;
	}

	get password() {
		return this.#user.Password;
	}

	get group() {
		return this.#user.Group;
	}

	get hidden() {
		return this.#user.Hidden;
	}

	get title() {
		return this.#user.Title;
	}

	get image() {
		return this.#user.Image;
	}
});