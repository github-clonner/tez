if (!Array.isArray) {
	
	Array.isArray = function isArray(arrayLike) {
		return typeof(arrayLike) === "object" && arrayLike.push !== undefined && arrayLike.slice !== undefined;
	};
}
