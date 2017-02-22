let URLComponent = function( opts = {} ) {
	this.hash = new Tez.hashURL( {
		prefix: opts.prefixURL
	} );
	this.async = opts.async !== undefined ? opts.async : true;
	this.xhr = new Tez.XHR();
	this.loadRealLink = opts.loadRealLink !== undefined ? opts.loadRealLink : true;
	return this;
};
URLComponent.prototype = {
	request( url, method, withCredentials ) {
		this.hash.set( url );
		if ( this.loadRealLink ) {
			this.xhr.request( method || "GET", url, this.async );
			this.xhr.withCredentials( withCredentials );
			this.xhr.send();
		}
		return this;
	}
	, then( fn ) {
		if ( this.loadRealLink && this.hash.getChanged() ) {
			const __self__ = this.xhr;
			const __self__hash__ = this.hash;
			let __eventFunc__;
			this.xhr.on( 'load', __eventFunc__ = function() {
				const args = ARRAY_SLICE.call( arguments );
				if ( __self__hash__.getChanged() ) {
					fn.apply( this, args );
					__self__.off( 'load', __eventFunc__ );
				}
			} );
		} else if ( this.hash.getChanged() ) {
			fn.call( this, {
				onlyURLChanged: true
			} );
		}
		return this;
	}
};

export default URLComponent;