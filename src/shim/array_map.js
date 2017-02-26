if ( Array.prototype.map === undefined ) {
	Array.prototype.map = function (fn, scope) {
		let i = 0;
		if (!fn) return false;
		while (i < this.length) {
			this[i] = fn.call(scope || this[i], this[i], i);
			i++
		}
		return this;
	};
}