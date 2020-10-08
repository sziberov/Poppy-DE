return class /*extends Object*/ {
	#tag = Date.now().toString().split('').sort(() => (Math.random()-0.5)).join('');
//	#observers = []

//	constructor(..._arguments) {
//		super(..._arguments);
//	}

	static observe(object = {}, _function) {
		return new Proxy(object, {
			set: (t, k, v) => {
			//	if(k !== 'length' || k == 'length' && t[k] > v) {
					t[k] = v;
					_function(k, v);
			//	} else {
			//		t[k] = v;
			//	}

				return true;
			}
		});
	}
}