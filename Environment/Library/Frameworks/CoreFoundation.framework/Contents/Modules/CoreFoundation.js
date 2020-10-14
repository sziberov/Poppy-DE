/*
	CoreFoundation Framework v0.1:
		Contains files|process management tools.
*/

_import('@Title', 'CFProcessInfo');
_import('@Title', 'CFFile');
_import('@Title', 'CFDefaults');
_import('@Title', 'CFIdentity');
_import('@Title', 'CFEventEmitter');
_import('@Title', 'CFArray');
_import('@Title', 'CFObject');
_import('@Title', 'CFDirectory');
_import('@Title', 'CFBundle');

if(!_request('seInfo', '@Title')) {
	_request('seCreate', 'read', '@Title');
}

new CFProcessInfo().environment._CFShared = _request('seInfo', '@Title').environment;