// noinspection JSAnnotator
return (key, bundle = CFBundle.main) => {
	let language = new CFPreferences('Global').get().PreferredLanguages[0],
		localizedStrings = bundle.localizations[language]?.Localized

	return language && localizedStrings ? localizedStrings[key] || value || key : value || key
}