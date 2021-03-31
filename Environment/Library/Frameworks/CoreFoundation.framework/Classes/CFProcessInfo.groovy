class CFProcessInfo {
	private __info

	def identifier,
		parentIdentifier,
		terminalIdentifier,
		user,
		path,
		arguments,
		environment

	CFProcessInfo(search = null) {
		__info = Environment.request("info", search)

		if (__info != false) {
			identifier = __info.id
			parentIdentifier = __info.parentId
			terminalIdentifier = __info.terminalId
			user = __info.user
			path = __info.path
			arguments = __info.arguments
			environment = search == null ? this.class.classLoader : null
		}
	}
}