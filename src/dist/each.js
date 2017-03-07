const _each = (t, fn, scope) => {
	if (typeof(t) === "object") {
		let i;
		if (t.length) {
			i = 0;
			while (i < t.length) {
				fn.call(scope || t[i], t[i], i);
				i++;
			}
		} else {
			for (i in t) {
				fn.call(scope || t[i], t[i], i);
			}
		}
	}
}
export { _each };