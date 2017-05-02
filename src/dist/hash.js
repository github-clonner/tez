class hashURL {
 constructor( { prefix = '!/#' } = {} ) {
	this._prefix = prefix || "!/#";
	this._hashTags = true;
	this._changed = false;
	return this;
	}
	getHash( hash ) {
		return this._prefix + hash;
	}
	getLocationHash() {
		return window.location.hash.substr( 1 );
	}
	isChanged() {
		return this._changed;
	}
	setHash( hash ) {
		if ( this.getHash( hash ) !== this.getLocationHash() ) {
			window.location.hash = this.getHash( hash );
			this._changed = true;
		} else {
			this._changed = false;
		}
		return this;
	}
	set( url ) {
		return this.setHash( url );
	}
};
export default hashURL;