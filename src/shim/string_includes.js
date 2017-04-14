if ( !String.prototype.includes ) {
	String.prototype.includes = function (find) {
		return this.indexOf(find) > -1;
	};
}