_import('CoreFoundation', 'CFPreferences');
_import('CoreFoundation', 'CFBundle');

// noinspection JSAnnotator
return CFLocalizedString = async (key, bundle) => {
	let language = (await CFPreferences.new('Global')).get().PreferredLanguages[0],
		localizedStrings = (bundle ?? CFBundle.main).localizations[language]?.Localized;

	return language && localizedStrings ? localizedStrings[key] ?? value ?? key : value ?? key;
}