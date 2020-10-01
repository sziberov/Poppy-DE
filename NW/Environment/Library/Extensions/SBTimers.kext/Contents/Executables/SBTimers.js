const setTimeouts = [];
window.setTimeout = function customSetTimeout(cb, interval) {
	const now = window.performance.now();
	const index = setTimeouts.length;
	setTimeouts[index] = () => {
		cb();
	};
	setTimeouts[index].active = true;
	const handleMessage = (evt) => {
		if (evt.data === index) {
			if (window.performance.now() - now >= interval) {
				window.removeEventListener('message', handleMessage);
				if (setTimeouts[index].active) {
					setTimeouts[index]();
				}
			} else {
				window.postMessage(index, '*');
			}
		}
	};
	window.addEventListener('message', handleMessage);
	window.postMessage(index, '*');
	return index;
}

window.clearTimeout = function customClearTimeout(setTimeoutId) {
	if (setTimeouts[setTimeoutId]) {
		setTimeouts[setTimeoutId].active = false;
	}
}

const setIntervals = [];
window.setInterval = function customSetInterval(cb, interval) {
	const intervalId = setIntervals.length;
	setIntervals[intervalId] = function () {
		if (setIntervals[intervalId].active) {
			cb();
			customSetTimeout(setIntervals[intervalId], interval);
		}
	};
	setIntervals[intervalId].active = true;
	customSetTimeout(setIntervals[intervalId], interval);
	return intervalId;
}

window.clearInterval = function customClearInterval(intervalId) {
	if (setIntervals[intervalId]) {
		setIntervals[intervalId].active = false;
	}
}

/*
return {
	setTimeout: customSetTimeout,
	clearTimeout: customClearTimeout,
	setInterval: customSetInterval,
	clearInterval: customClearInterval
}
*/