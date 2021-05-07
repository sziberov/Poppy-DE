/*
	CoreFoundation Framework v0.1:
		Contains files|process management tools.
*/

_import('@Title', 'CFProcessInfo');
_import('@Title', 'CFFile');
_import('@Title', 'CFDirectory');
_import('@Title', 'CFPreferences');
_import('@Title', 'CFIdentity');
_import('@Title', 'CFEventEmitter');
_import('@Title', 'CFArray');
_import('@Title', 'CFObject');
_import('@Title', 'CFString');
_import('@Title', 'CFBundle');
_import('@Title', 'CFLocalizedString');

if(!_request('seInfo', '@Title')) {
	_request('seCreate', 'read', '@Title');
}

CFProcessInfo.shared.environment.$CFShared = _request('seInfo', '@Title').environment;