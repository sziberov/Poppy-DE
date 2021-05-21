/*
	CoreGraphics Framework v0.1:
		Contains appearance|elements|font management tools.
*/

_import('CoreFoundation');

_import(_title, 'CGScreen');
_import(_title, 'CGColor');
_import(_title, 'CGWindowServer');
_import(_title, 'CGImage');
_import(_title, 'CGLayer');
_import(_title, 'CGAppearance');
_import(_title, 'CGElement');
_import(_title, 'CGCursor');
_import(_title, 'CGFontManager');

CFProcessInfo.shared.environment.$CGAppearance = new CGAppearance(new CFBundle(_path).resourcesURL+'/Appearance.css').add();

$CFShared.CGWindowServer = CGWindowServer;
$CFShared.CGAppearance = CGAppearance;
$CFShared.CGCursor = CGCursor;
$CFShared.CGFontManager = CGFontManager;