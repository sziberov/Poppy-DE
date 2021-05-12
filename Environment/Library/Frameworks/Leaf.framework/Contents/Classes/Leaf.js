/*
	Leaf Framework v0.1:
		Contains graphical applications building tools.
*/

_import('CoreFoundation');
_import('CoreGraphics');

_import(_title, 'LFObject');
_import(_title, 'LFResponder');
_import(_title, 'LFView');
_import(_title, 'LFConstraint');
_import(_title, 'LFControl');
_import(_title, 'LFButton');
_import(_title, 'LFMenubar');
_import(_title, 'LFMenu');
_import(_title, 'LFMenuItem');
_import(_title, 'LFWorkspace');
_import(_title, 'LFLaunchedApplication');
_import(_title, 'LFApplication');
_import(_title, 'LFWindow');
_import(_title, 'LFFrame');
_import(_title, 'LFTitlebar');
_import(_title, 'LFTitlebarButton');
_import(_title, 'LFToolbar');
_import(_title, 'LFSidebar');
_import(_title, 'LFImage');
_import(_title, 'LFText');
_import(_title, 'LFTable');
_import(_title, 'LFTableRow');
_import(_title, 'LFAlert');

new LFApplication();
CFProcessInfo.shared.environment.$LFAppearance = new CGAppearance(new CFBundle(_path).resourcesURL+'/Appearance.less').add();

$CFShared.LFMenubar = LFMenubar;
$CFShared.LFWorkspace = LFWorkspace;