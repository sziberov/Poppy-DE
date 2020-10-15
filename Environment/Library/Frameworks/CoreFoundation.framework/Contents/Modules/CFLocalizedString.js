return (string) => {
	var language = new CFPreferences('Global').get().PreferredLanguages[0],
		localizedStrings = new CFBundle(new CFProcessInfo().path.split('.app')[0]+'.app').localizations[language].Localized

	return language && localizedStrings ? localizedStrings[string] || string : string
}