// noinspection JSAnnotator
return (key, URL/*, { bundle, value } = {}*/) => {
	let bundle = URL ? new CFBundle(CFString.splitByLast(URL, '/Contents/')[0]) : CFBundle.main/*bundle ? bundle : CFBundle.main*/,
		language = new CFPreferences('Global').get().PreferredLanguages[0],
		localizedStrings = bundle.localizations[language]?.Localized

	return language && localizedStrings ? localizedStrings[key] || value || key : value || key
}