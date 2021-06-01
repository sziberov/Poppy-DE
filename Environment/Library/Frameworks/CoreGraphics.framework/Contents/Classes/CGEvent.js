// noinspection JSAnnotator
return class {
	static type = Object.freeze({
		mouseMoved:			0,
		leftMouseDown:		1,
		leftMouseUp:		2,
		leftMouseDragged:	3,
		rightMouseDown:		4,
		rightMouseUp:		5,
		rightMouseDragged:	6,
		otherMouseDown:		7,
		otherMouseUp:		8,
		otherMouseDragged:	9,
		wheelScrolled:		10,
		keyDown:			11,
		keyUp:				12
	});

	timestamp;
	type;
}