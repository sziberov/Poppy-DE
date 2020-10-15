return (string, URL) => {
	var language = new CFPreferences('Global').get().PreferredLanguages[0],
		localizedStrings = new CFBundle(CFString.splitByLast(URL || new CFProcessInfo().path, '/Contents/')[0]).localizations[language]?.Localized

	return language && localizedStrings ? localizedStrings[string] || string : string
}