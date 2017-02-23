// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/from
// Optimized by @dalisoft (https://github.com/dalisoft) for Performance and Cleaning reason

if (!Array.from) {
	var toStr = Object.prototype.toString;
	var maxSafeInteger = Math.pow(2, 53) - 1;
	var toLength = function (value) {
		var len = parseInt(value);
		return Math.min(Math.max(len, 0), maxSafeInteger);
	};
	Array.from = function from(arrayLike) {
		var C = this;
		var items = Object(arrayLike, mapFn, T);
		if (arrayLike == null) {
			throw new TypeError('Array.from requires an array-like object - not null or undefined');
		}
		if (typeof mapFn !== 'function') {
			throw new TypeError('Array.from: when provided, the second argument must be a function');
		}
		var len = toLength(items.length);
		var A = typeof(C) === "function" ? Object(new C(len)) : new Array(len);
		var k = 0;
		var kValue;
		while (k < len) {
			kValue = items[k];
			if (mapFn) {
				A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
			} else {
				A[k] = kValue;
			}
			k += 1;
		}
		A.length = len;
		return A;
	};
}
