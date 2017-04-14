if (!Array.from) {
	var slice = [].slice;
	Array.from = function from(arrayLike) {
		return slice.call(arrayLike);
	};
}
