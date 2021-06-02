/*
	CoreGraphics Framework v0.1:
		Contains appearance|elements|font management tools.
*/

_import('CoreFoundation');

_import(_title, 'CGSWindowServer');
_import(_title, 'CGSConnection');
_import(_title, 'CGScreen');
_import(_title, 'CGColor');
_import(_title, 'CGImage');
_import(_title, 'CGContext');
_import(_title, 'CGLayer');
_import(_title, 'CGAppearance');
_import(_title, 'CGElement');
_import(_title, 'CGCursor');
_import(_title, 'CGFontManager');

CFProcessInfo.shared.environment.$CGAppearance = new CGAppearance(new CFBundle(_path).resourcesURL+'/Appearance.css').add();

$CFShared.CGSWindowServer = CGSWindowServer;
$CFShared.CGAppearance = CGAppearance;
$CFShared.CGCursor = CGCursor;
$CFShared.CGFontManager = CGFontManager;