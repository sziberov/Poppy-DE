/*
	CoreFoundation Framework v0.1:
		Contains files|process management tools.
*/

_import(_title, 'CFProcessInfo');
_import(_title, 'CFFile');
_import(_title, 'CFDirectory');
_import(_title, 'CFPreferences');
_import(_title, 'CFIdentity');
_import(_title, 'CFEventEmitter');
_import(_title, 'CFArray');
_import(_title, 'CFObject');
_import(_title, 'CFString');
_import(_title, 'CFURL');
_import(_title, 'CFBundle');
_import(_title, 'CFLocalizedString');

if(!_request('seInfo', _title)) {
	_request('seCreate', 'read', _title);
}

CFProcessInfo.shared.environment.$CFShared = _request('seInfo', _title).environment;