// noinspection JSAnnotator
return class CGSWindow {
	// Теги со звёздочкой означают, что (мне так кажется) на них должен реагировать не оконный сервер, а вышестоящий фреймфорк
	static style = {
		allowedBeforeLogin:			0,
		attached:					1,
		attachedToMenubar:			2,	// *
		awaitsDrop:					3,	// *
		cantHide:					4,	// *
		desktopBackground:			5,	// *
		draggableByServer:			6,
		followsCurrentWorkspace:	7,
		hidden:						8,	// *
		hidesOnDeactivation:		9,	// *
		ignoresActivation:			10,	// *
		ignoresCycle:				11,	// *
		ignoresMouseEvents:			12,
		ignoresOrderingToFront:		13,
		inCycle:					14,	// *
		maximizable:				15,
		maximized:					16,
		mergedWithMenubar:			17,	// *
		mirror:						18,
		modal:						19,	// *
		onAllWorkspaces:			20,
		setsCursorInBackground:		21,
		shadowless:					22,
		worksWhenModal:				23	// *
	}

	static create() {}

	static getWorkspace() {}

	static getOrigin() {}

	static getFrame() {}

	static getLevel() {}

	static getDepth() {}

	static setWorkspace() {}

	static setOrigin() {}

	static setFrame() {}

	static setLevel() {}

	static setDepth() {}

	static destroy() {}
}