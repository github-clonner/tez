let hashURL = function( opts = {} ) {
	this._prefix = opts.prefix || "!/#";
	this._hashTags = true;
	this._changed = false;
	return this;
};
hashURL.prototype = {
	getHash( hash ) {
		return this._prefix + hash;
	}
	, getLocationHash() {
		return window.location.hash.substr( 1 );
	}
	, getChanged() {
		return this._changed;
	}
	, setHash( hash ) {
		if ( this.getHash( hash ) !== this.getLocationHash() ) {
			window.location.hash = this.getHash( hash );
			this._changed = true;
		} else {
			this._changed = false;
		}
		return this;
	}
	, set( url ) {
		return this.setHash( url );
	}
};
export default hashURL;