export function extend(a = {}, b = {}) {
	for (const p in b) {
		if (a[p] === undefined && b[p] !== undefined) {
			a[p] = b[p];
		}
	}
	return a;
}
