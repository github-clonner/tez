if ( Array.prototype.filter === undefined ) {
	Array.prototype.filter = function (fn) {
		let i = 0;
		if (!fn) return false;
		while (i < this.length) {
			if (!fn(this[i])) {
				this.splice(i, 1);
			} else {
				i++
			}
		}
		return this;
	};
}