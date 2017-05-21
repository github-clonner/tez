export default function extend(a = {}, b = {}) {
	for (let p in b) {
		if (a[p] === undefined && b[p] !== undefined) {
			a[p] = b[p];
		}
	}
	return a;
}
