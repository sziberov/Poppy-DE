return class {
	constructor() {
		_import('Leaf');

		new LFApp().focusingPolicy = 1;

		/*
		<Dock>
			<List>
				<Item active></Item>
				<Item></Item>
			</List>
			<Activity></Activity>
		</Dock>
		*/
	}
}