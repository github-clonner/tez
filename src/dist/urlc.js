class URLComponent {
	constructor ( opts = {} ) {
	this.hash = new Tez.hashURL( {
		prefix: opts.prefixURL
	} );
	this.async = opts.async !== undefined ? opts.async : true;
	this.xhr = new Tez.XHR();
	this.loadRealLink = opts.loadRealLink !== undefined ? opts.loadRealLink : true;
	return this;
	}
	request( url, method, withCredentials ) {
		this.hash.set( url );
		if ( this.loadRealLink ) {
			this.xhr.request( method || "GET", url, this.async );
			this.xhr.withCredentials( withCredentials );
			this.xhr.send();
		}
		return this;
	}
	then( fn ) {
		if ( this.loadRealLink && this.hash.isChanged() ) {
			const __self__ = this.xhr;
			const __self__hash__ = this.hash;
			let __eventFunc__;
			this.xhr.on( 'load', __eventFunc__ = function() {
				const args = ARRAY_SLICE.call( arguments );
				if ( __self__hash__.isChanged() ) {
					fn.apply( this, args );
					__self__.off( 'load', __eventFunc__ );
				}
			} );
		} else if ( this.hash.isChanged() ) {
			fn.call( this, {
				onlyURLChanged: true
			} );
		}
		return this;
	}
};

export default URLComponent;