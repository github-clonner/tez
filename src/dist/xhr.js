let XHR = function( opts = {} ) {
	this._xhr = new XMLHttpRequest();
	const xhr = this;
	if ( opts.load ) {
		xhr.on( 'load', opts.load );
	}
	if ( opts.url ) {
		xhr.request( opts.method || "GET", opts.url, opts.async );
		xhr.send( opts.params );
	}
	if ( opts.events ) {
		opts.events.map( event => {
			xhr.on( event.name, event.callback );
		} );
	}
	return this;
};
XHR.prototype = {
	on( ev, fn ) {
		this._xhr.addEventListener( ev, fn );
		return this;
	}
	, withCredentials( state ) {
		this._xhr.withCredentials = state !== undefined ? state : false;
		return this;
	}
	, off( ev, fn ) {
		this._xhr.removeEventListener( ev, fn );
		return this;
	}
	, request( method, url, async ) {
		this._xhr.open( method, url, async );
		return this;
	}
	, send( params ) {
		if ( params ) {
			this._xhr.send( params );
		} else {
			this._xhr.send();
		}
		return this;
	}
};

export default XHR;